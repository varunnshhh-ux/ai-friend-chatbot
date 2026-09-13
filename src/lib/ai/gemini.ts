import { GoogleGenerativeAI } from '@google/generative-ai';
import { MemoryItem, MoodType, PersonaMode } from '@/types';
import { buildSystemPrompt } from './prompts';

const apiKey = process.env.GEMINI_API_KEY || '';
const defaultModelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
}

export async function generateGeminiChatStream(
  history: { role: 'user' | 'assistant' | 'system'; content: string }[],
  persona: PersonaMode,
  detectedMood: MoodType,
  memories: MemoryItem[],
  userName?: string
) {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      genAI = new GoogleGenerativeAI(key);
    } else {
      throw new Error('GEMINI_API_KEY is not configured');
    }
  }

  const systemInstruction = buildSystemPrompt(persona, detectedMood, memories, userName);

  const model = genAI.getGenerativeModel({
    model: defaultModelName,
    systemInstruction,
  });

  // Map messages to Gemini format (Gemini expects role 'user' or 'model')
  const formattedContents = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: formattedContents.slice(0, -1),
  });

  const lastMessage = formattedContents[formattedContents.length - 1];
  const lastText = lastMessage?.parts[0]?.text || '';

  const result = await chat.sendMessageStream(lastText);
  return result.stream;
}
