import { NextRequest, NextResponse } from 'next/server';
import {
  addMessage,
  addMemory,
  getRelevantMemories,
  getPreferences,
  saveConversation,
  getConversation,
} from '@/lib/db/storage';
import { detectMood } from '@/lib/ai/moodDetector';
import { isGeminiConfigured, generateGeminiChatStream } from '@/lib/ai/gemini';
import { generateFallbackPersonaResponse } from '@/lib/ai/fallbackPersonaEngine';
import { ChatMessage, MoodType, PersonaMode } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      conversationId,
      messages,
      persona = 'friend',
      attachment,
    }: {
      conversationId: string;
      messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
      persona: PersonaMode;
      attachment?: { name: string; type: string; dataUrl: string };
    } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1];
    const userText = lastUserMessage.content || '';

    // 1. Detect Mood
    const detectedMood: MoodType = detectMood(userText);

    // 2. Save user message in storage
    const userMsgRecord: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
      detectedMood,
      attachment,
    };
    addMessage(userMsgRecord);

    // 3. Ensure Conversation exists
    let conv = getConversation(conversationId);
    if (!conv) {
      conv = {
        id: conversationId,
        title: userText.slice(0, 35) + (userText.length > 35 ? '...' : ''),
        persona,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMood: detectedMood,
      };
      saveConversation(conv);
    } else if (conv.messageCount && conv.messageCount <= 2) {
      // Auto-generate a friendly title if it's the start
      conv.title = userText.slice(0, 35) + (userText.length > 35 ? '...' : '');
      saveConversation(conv);
    }

    // 4. Retrieve personalized memories & preferences
    const preferences = getPreferences();
    const memories = getRelevantMemories(userText, 5);

    // 5. Check if we should use Gemini or Fallback Persona Engine
    const useGemini = isGeminiConfigured();

    if (!useGemini) {
      // Fallback Companion Engine for instant offline / demo usage
      const fallbackResult = generateFallbackPersonaResponse(
        userText,
        persona,
        detectedMood,
        memories,
        preferences.userName
      );

      // Auto-save any detected memories
      if (fallbackResult.newMemories && fallbackResult.newMemories.length > 0) {
        fallbackResult.newMemories.forEach((mem) => {
          addMemory(mem);
        });
      }

      // Save assistant message in storage
      const assistantMsgRecord: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        conversationId,
        role: 'assistant',
        content: fallbackResult.content,
        timestamp: new Date().toISOString(),
        detectedMood: fallbackResult.detectedMood,
        usedMemories: memories.map((m) => m.content),
        songData: fallbackResult.songData,
      };
      addMessage(assistantMsgRecord);

      // Stream simulated response to client
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Send metadata event first
          const metaPayload = JSON.stringify({
            type: 'meta',
            detectedMood: fallbackResult.detectedMood,
            usedMemories: memories.map((m) => m.content),
            songData: fallbackResult.songData,
          });
          controller.enqueue(encoder.encode(`data: ${metaPayload}\n\n`));

          // Simulate fluid word-by-word streaming
          const chunks = fallbackResult.content.split(' ');
          for (let i = 0; i < chunks.length; i++) {
            const word = chunks[i] + (i < chunks.length - 1 ? ' ' : '');
            const chunkPayload = JSON.stringify({ type: 'content', text: word });
            controller.enqueue(encoder.encode(`data: ${chunkPayload}\n\n`));
            await new Promise((resolve) => setTimeout(resolve, 20));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // 6. Real Google Gemini API Streaming
    try {
      const geminiStream = await generateGeminiChatStream(
        messages,
        persona,
        detectedMood,
        memories,
        preferences.userName
      );

      let fullGeneratedText = '';
      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          // Send meta payload
          const metaPayload = JSON.stringify({
            type: 'meta',
            detectedMood,
            usedMemories: memories.map((m) => m.content),
          });
          controller.enqueue(encoder.encode(`data: ${metaPayload}\n\n`));

          try {
            for await (const chunk of geminiStream) {
              const chunkText = chunk.text();
              fullGeneratedText += chunkText;
              const chunkPayload = JSON.stringify({ type: 'content', text: chunkText });
              controller.enqueue(encoder.encode(`data: ${chunkPayload}\n\n`));
            }

            // Save assistant message to DB
            const assistantMsgRecord: ChatMessage = {
              id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              conversationId,
              role: 'assistant',
              content: fullGeneratedText,
              timestamp: new Date().toISOString(),
              detectedMood,
              usedMemories: memories.map((m) => m.content),
            };
            addMessage(assistantMsgRecord);

            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (streamErr) {
            console.error('Error during Gemini stream:', streamErr);
            controller.error(streamErr);
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    } catch (geminiErr) {
      console.error('Gemini error, falling back to local companion:', geminiErr);
      // Fallback gracefully on rate limits or network issues
      const fallback = generateFallbackPersonaResponse(
        userText,
        persona,
        detectedMood,
        memories,
        preferences.userName
      );

      const assistantMsgRecord: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        role: 'assistant',
        content: fallback.content,
        timestamp: new Date().toISOString(),
        detectedMood: fallback.detectedMood,
        songData: fallback.songData,
      };
      addMessage(assistantMsgRecord);

      return NextResponse.json({
        content: fallback.content,
        detectedMood: fallback.detectedMood,
        songData: fallback.songData,
      });
    }
  } catch (error) {
    console.error('POST /api/chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
