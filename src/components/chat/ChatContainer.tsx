'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Conversation, ChatMessage, PersonaMode, MemoryItem, MoodType } from '@/types';
import Sidebar from '../sidebar/Sidebar';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import MemoryModal from '../memory/MemoryModal';
import VoiceCallModal from '../voice/VoiceCallModal';
import {
  Menu,
  Download,
  Trash2,
  Sparkles,
  Share2,
  Check,
  Brain,
  Headphones,
} from 'lucide-react';
import { PERSONA_META } from '@/lib/utils';

export default function ChatContainer() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [currentPersona, setCurrentPersona] = useState<PersonaMode>('friend');

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Initial load
  useEffect(() => {
    fetchConversations();
    fetchMemories();
  }, []);

  // 2. Load conversation messages when activeConversationId changes
  useEffect(() => {
    if (activeConversationId) {
      fetchConversationMessages(activeConversationId);
    }
  }, [activeConversationId]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      if (data.conversations && data.conversations.length > 0) {
        setConversations(data.conversations);
        if (!activeConversationId) {
          setActiveConversationId(data.conversations[0].id);
          setCurrentPersona(data.conversations[0].persona || 'friend');
        }
      } else {
        handleNewChat('friend');
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memories');
      const data = await res.json();
      if (data.memories) {
        setMemories(data.memories);
      }
    } catch (err) {
      console.error('Failed to fetch memories:', err);
    }
  };

  const fetchConversationMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
      if (data.conversation?.persona) {
        setCurrentPersona(data.conversation.persona);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  // Chat Actions
  const handleNewChat = async (persona: PersonaMode = 'friend') => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Conversation',
      persona,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      messageCount: 0,
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setMessages([]);
    setCurrentPersona(persona);
    setIsSidebarOpen(false);

    try {
      await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConv),
      });
    } catch (err) {
      console.error('Error creating new conversation:', err);
    }
  };

  const handleRenameConversation = async (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
    try {
      await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
    } catch (err) {
      console.error('Failed to rename conversation:', err);
    }
  };

  const handleTogglePin = async (id: string, isPinned: boolean) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned } : c))
    );
    try {
      await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned }),
      });
    } catch (err) {
      console.error('Failed to pin conversation:', err);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);

    if (activeConversationId === id) {
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        handleNewChat('friend');
      }
    }

    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleClearAllConversations = async () => {
    if (!confirm('Are you sure you want to clear all conversation history?')) return;
    setConversations([]);
    setMessages([]);
    handleNewChat('friend');
    try {
      await fetch('/api/conversations', { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to clear conversations:', err);
    }
  };

  // Memory Actions
  const handleAddMemory = async (mem: Omit<MemoryItem, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mem),
      });
      const data = await res.json();
      if (data.memory) {
        setMemories((prev) => [data.memory, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add memory:', err);
    }
  };

  const handleUpdateMemory = async (id: string, updates: Partial<MemoryItem>) => {
    try {
      const res = await fetch(`/api/memories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.memory) {
        setMemories((prev) => prev.map((m) => (m.id === id ? data.memory : m)));
      }
    } catch (err) {
      console.error('Failed to update memory:', err);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch(`/api/memories/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete memory:', err);
    }
  };

  const handleClearAllMemories = async () => {
    if (!confirm('Are you sure you want to clear all personal memories?')) return;
    setMemories([]);
    try {
      await fetch('/api/memories', { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to clear memories:', err);
    }
  };

  // Main Send Message Flow with Streaming
  const handleSendMessage = async (
    content: string,
    attachment?: { name: string; type: string; dataUrl: string }
  ) => {
    if (!content.trim() && !attachment) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      attachment,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsStreaming(true);
    setStreamingContent('');

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversationId,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          persona: currentPersona,
          attachment,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Chat API responded with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAssistantText = '';
      let metaData: {
        detectedMood?: MoodType;
        usedMemories?: string[];
        songData?: any;
      } = {};

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.type === 'meta') {
                metaData = parsed;
              } else if (parsed.type === 'content') {
                fullAssistantText += parsed.text;
                setStreamingContent(fullAssistantText);
              }
            } catch {
              // Raw text chunk fallback
              if (dataStr && dataStr !== '[DONE]') {
                fullAssistantText += dataStr;
                setStreamingContent(fullAssistantText);
              }
            }
          }
        }
      }

      const assistantMessage: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        conversationId: activeConversationId,
        role: 'assistant',
        content: fullAssistantText,
        timestamp: new Date().toISOString(),
        detectedMood: metaData.detectedMood,
        usedMemories: metaData.usedMemories,
        songData: metaData.songData,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsStreaming(false);
      setStreamingContent('');

      // Refresh conversations & memories in background to reflect any new extracted data
      fetchConversations();
      fetchMemories();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('User stopped generation');
      } else {
        console.error('Send message error:', err);
      }
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  const handleTriggerSingMode = () => {
    handleSendMessage('Mera mood thoda low hai. Can you compose and perform a short original song for me? 🎵');
  };

  // Export Conversation
  const handleExportChat = (format: 'md' | 'json') => {
    const activeConv = conversations.find((c) => c.id === activeConversationId);
    const title = activeConv?.title || 'Aura-Chat-Export';

    let fileData = '';
    let mimeType = 'text/markdown';
    let extension = 'md';

    if (format === 'json') {
      fileData = JSON.stringify({ conversation: activeConv, messages }, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else {
      fileData = `# ${title}\n*Exported from Aura AI Companion on ${new Date().toLocaleString()}*\n\n---\n\n`;
      messages.forEach((m) => {
        const sender = m.role === 'assistant' ? '🤖 Aura' : '👤 You';
        fileData += `### ${sender} (${new Date(m.timestamp).toLocaleTimeString()})\n\n${m.content}\n\n---\n\n`;
      });
    }

    const blob = new Blob([fileData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper for voice call modal
  const handleVoiceCallSendMessage = async (text: string): Promise<string> => {
    return new Promise((resolve) => {
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: activeConversationId,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversationId,
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          persona: currentPersona,
        }),
      })
        .then(async (res) => {
          if (!res.body) {
            resolve("I'm here with you! What else is on your mind?");
            return;
          }
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let fullText = '';
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.replace('data: ', '').trim();
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.type === 'content') fullText += parsed.text;
                } catch {
                  if (dataStr && dataStr !== '[DONE]') fullText += dataStr;
                }
              }
            }
          }

          const assistantMessage: ChatMessage = {
            id: `msg-resp-${Date.now()}`,
            conversationId: activeConversationId,
            role: 'assistant',
            content: fullText,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          resolve(fullText);
        })
        .catch((err) => {
          console.error(err);
          resolve("I'm right here with you!");
        });
    });
  };

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const personaMeta = PERSONA_META[currentPersona] || PERSONA_META.friend;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 ambient-glow-mesh text-zinc-100 antialiased select-none">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          setActiveConversationId(id);
          setIsSidebarOpen(false);
        }}
        onNewChat={handleNewChat}
        onRenameConversation={handleRenameConversation}
        onTogglePin={handleTogglePin}
        onDeleteConversation={handleDeleteConversation}
        onClearAll={handleClearAllConversations}
        onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
        onOpenVoiceCall={() => setIsVoiceCallOpen(true)}
        memoryCount={memories.length}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Chat View */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Top Navbar */}
        <header className="h-14 border-b border-zinc-800/80 glass-panel px-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">{personaMeta.emoji}</span>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate flex items-center gap-2">
                  <span>{activeConv?.title || 'Aura AI Companion'}</span>
                </h2>
                <p className="text-[10px] text-zinc-400 truncate">
                  {personaMeta.name} • {personaMeta.tag}
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5">
            {/* Quick Memory Hub button */}
            <button
              onClick={() => setIsMemoryModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-xs transition-colors"
              title="Open Personal Memory Hub"
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline font-medium">Memory ({memories.length})</span>
            </button>

            {/* Quick Voice Call button */}
            <button
              onClick={() => setIsVoiceCallOpen(true)}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 transition-colors"
              title="Launch Fullscreen Voice Call"
            >
              <Headphones className="w-4 h-4" />
            </button>

            {/* Export Dropdown / Trigger */}
            <button
              onClick={() => handleExportChat('md')}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors hidden sm:flex"
              title="Export chat as Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Message List */}
        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          onRegenerate={() => {
            const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
            if (lastUserMsg) {
              handleSendMessage(lastUserMsg.content, lastUserMsg.attachment);
            }
          }}
          onSelectPrompt={(prompt) => handleSendMessage(prompt)}
          userName=""
        />

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isStreaming={isStreaming}
          onStopGenerating={handleStopGenerating}
          currentPersona={currentPersona}
          onSelectPersona={(mode) => {
            setCurrentPersona(mode);
            if (activeConv) {
              handleRenameConversation(activeConv.id, activeConv.title);
            }
          }}
          onTriggerSingMode={handleTriggerSingMode}
        />
      </main>

      {/* Memory Hub Modal */}
      <MemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        memories={memories}
        onAddMemory={handleAddMemory}
        onUpdateMemory={handleUpdateMemory}
        onDeleteMemory={handleDeleteMemory}
        onClearAll={handleClearAllMemories}
      />

      {/* Fullscreen Voice Call Room */}
      <VoiceCallModal
        isOpen={isVoiceCallOpen}
        onClose={() => setIsVoiceCallOpen(false)}
        persona={currentPersona}
        onSendMessage={handleVoiceCallSendMessage}
      />
    </div>
  );
}
