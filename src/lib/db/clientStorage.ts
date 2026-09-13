import { Conversation, ChatMessage, MemoryItem, PersonaMode, MoodType } from '@/types';

const CONVERSATIONS_KEY = 'aura_conversations';
const MESSAGES_KEY = 'aura_messages';
const MEMORIES_KEY = 'aura_memories';

const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'default-welcome',
    title: '🌟 Welcome to Aura AI',
    persona: 'friend',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: true,
    messageCount: 1,
    lastMood: 'happy',
  },
];

const DEFAULT_MESSAGES: Record<string, ChatMessage[]> = {
  'default-welcome': [
    {
      id: 'msg-welcome-1',
      conversationId: 'default-welcome',
      role: 'assistant',
      content: `Hey there! I'm **Aura**, your personal AI companion, friend, and guide. 🌟

I'm here whenever you want to:
- 💬 **Have a genuine chat** about your day, dreams, or whatever's on your mind.
- 📚 **Study or understand complex concepts** with simple, intuitive explanations.
- 💻 **Write, refactor, or debug code** together like an experienced dev partner.
- 🎵 **Sing a song for you** or lift your mood with custom tunes and music.
- 🧠 **Remember things that matter to you** (like your interests, goals, and style) so our chats get richer over time.

How are you feeling today? Tell me what's on your mind! ✨`,
      timestamp: new Date().toISOString(),
      detectedMood: 'happy',
    },
  ],
};

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-seed-1',
    category: 'interest',
    content: 'Loves technology, creative learning, and exploring new AI ideas',
    importance: 4,
    createdAt: new Date().toISOString(),
    tags: ['ai', 'learning', 'tech'],
  },
  {
    id: 'mem-seed-2',
    category: 'preference',
    content: 'Appreciates friendly, warm, empathetic, and intellectually honest conversation',
    importance: 5,
    createdAt: new Date().toISOString(),
    tags: ['communication', 'tone'],
  },
];

export const clientStorage = {
  getConversations(): Conversation[] {
    if (typeof window === 'undefined') return DEFAULT_CONVERSATIONS;
    try {
      const saved = localStorage.getItem(CONVERSATIONS_KEY);
      if (!saved) {
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(DEFAULT_CONVERSATIONS));
        return DEFAULT_CONVERSATIONS;
      }
      return JSON.parse(saved);
    } catch {
      return DEFAULT_CONVERSATIONS;
    }
  },

  saveConversations(convs: Conversation[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(convs));
    } catch (e) {
      console.warn('Failed to save conversations to localStorage', e);
    }
  },

  getMessages(conversationId: string): ChatMessage[] {
    if (typeof window === 'undefined') return DEFAULT_MESSAGES[conversationId] || [];
    try {
      const saved = localStorage.getItem(`${MESSAGES_KEY}_${conversationId}`);
      if (!saved) {
        if (DEFAULT_MESSAGES[conversationId]) {
          localStorage.setItem(
            `${MESSAGES_KEY}_${conversationId}`,
            JSON.stringify(DEFAULT_MESSAGES[conversationId])
          );
          return DEFAULT_MESSAGES[conversationId];
        }
        return [];
      }
      return JSON.parse(saved);
    } catch {
      return [];
    }
  },

  saveMessages(conversationId: string, msgs: ChatMessage[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${MESSAGES_KEY}_${conversationId}`, JSON.stringify(msgs));
    } catch (e) {
      console.warn('Failed to save messages to localStorage', e);
    }
  },

  getMemories(): MemoryItem[] {
    if (typeof window === 'undefined') return DEFAULT_MEMORIES;
    try {
      const saved = localStorage.getItem(MEMORIES_KEY);
      if (!saved) {
        localStorage.setItem(MEMORIES_KEY, JSON.stringify(DEFAULT_MEMORIES));
        return DEFAULT_MEMORIES;
      }
      return JSON.parse(saved);
    } catch {
      return DEFAULT_MEMORIES;
    }
  },

  saveMemories(mems: MemoryItem[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(MEMORIES_KEY, JSON.stringify(mems));
    } catch (e) {
      console.warn('Failed to save memories to localStorage', e);
    }
  },
};
