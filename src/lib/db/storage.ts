import fs from 'fs';
import path from 'path';
import { Conversation, ChatMessage, MemoryItem, UserPreferences, PersonaMode, MoodType } from '@/types';

interface DatabaseSchema {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>; // keyed by conversationId
  memories: MemoryItem[];
  preferences: UserPreferences;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'storage.json');

const DEFAULT_DB: DatabaseSchema = {
  conversations: [
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
  ],
  messages: {
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
  },
  memories: [
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
  ],
  preferences: {
    userName: '',
    preferredVoice: '',
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    autoSpeakResponse: false,
    theme: 'dark',
    defaultPersona: 'friend',
  },
};

function ensureDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      return DEFAULT_DB;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data) as DatabaseSchema;
  } catch (error) {
    console.error('Error accessing local database:', error);
    return DEFAULT_DB;
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (error) {
    console.error('Error saving local database:', error);
  }
}

// ==========================================
// Conversations CRUD
// ==========================================
export function getConversations(): Conversation[] {
  const db = ensureDb();
  return (db.conversations || []).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function getConversation(id: string): Conversation | null {
  const db = ensureDb();
  return db.conversations.find((c) => c.id === id) || null;
}

export function saveConversation(conv: Conversation): Conversation {
  const db = ensureDb();
  const index = db.conversations.findIndex((c) => c.id === conv.id);
  if (index >= 0) {
    db.conversations[index] = { ...db.conversations[index], ...conv, updatedAt: new Date().toISOString() };
  } else {
    db.conversations.unshift({ ...conv, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  saveDb(db);
  return conv;
}

export function deleteConversation(id: string): boolean {
  const db = ensureDb();
  db.conversations = db.conversations.filter((c) => c.id !== id);
  delete db.messages[id];
  saveDb(db);
  return true;
}

export function clearAllConversations(): void {
  const db = ensureDb();
  db.conversations = [];
  db.messages = {};
  saveDb(db);
}

// ==========================================
// Messages CRUD
// ==========================================
export function getMessages(conversationId: string): ChatMessage[] {
  const db = ensureDb();
  return db.messages[conversationId] || [];
}

export function addMessage(msg: ChatMessage): ChatMessage {
  const db = ensureDb();
  if (!db.messages[msg.conversationId]) {
    db.messages[msg.conversationId] = [];
  }
  db.messages[msg.conversationId].push(msg);

  // Update conversation message count and updated timestamp
  const conv = db.conversations.find((c) => c.id === msg.conversationId);
  if (conv) {
    conv.messageCount = db.messages[msg.conversationId].length;
    conv.updatedAt = new Date().toISOString();
    if (msg.detectedMood) {
      conv.lastMood = msg.detectedMood;
    }
  }

  saveDb(db);
  return msg;
}

// ==========================================
// Memory System CRUD
// ==========================================
export function getMemories(): MemoryItem[] {
  const db = ensureDb();
  return (db.memories || []).sort((a, b) => b.importance - a.importance);
}

export function addMemory(item: Omit<MemoryItem, 'id' | 'createdAt'>): MemoryItem {
  const db = ensureDb();
  const newMemory: MemoryItem = {
    ...item,
    id: `mem-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  db.memories = db.memories || [];
  db.memories.push(newMemory);
  saveDb(db);
  return newMemory;
}

export function updateMemory(id: string, updates: Partial<MemoryItem>): MemoryItem | null {
  const db = ensureDb();
  const index = (db.memories || []).findIndex((m) => m.id === id);
  if (index === -1) return null;
  db.memories[index] = { ...db.memories[index], ...updates };
  saveDb(db);
  return db.memories[index];
}

export function deleteMemory(id: string): boolean {
  const db = ensureDb();
  db.memories = (db.memories || []).filter((m) => m.id !== id);
  saveDb(db);
  return true;
}

export function clearAllMemories(): void {
  const db = ensureDb();
  db.memories = [];
  saveDb(db);
}

export function getRelevantMemories(query: string, maxItems = 6): MemoryItem[] {
  const memories = getMemories();
  if (!memories.length) return [];

  const lowerQuery = query.toLowerCase();
  // Score memories based on importance and keyword matching
  const scored = memories.map((m) => {
    let score = m.importance;
    const contentLower = m.content.toLowerCase();
    const words = lowerQuery.split(/\s+/).filter((w) => w.length > 2);

    words.forEach((w) => {
      if (contentLower.includes(w)) score += 3;
      if (m.tags?.some((t) => t.toLowerCase().includes(w))) score += 2;
    });

    return { memory: m, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map((s) => s.memory);
}

// ==========================================
// Preferences
// ==========================================
export function getPreferences(): UserPreferences {
  const db = ensureDb();
  return {
    ...db.preferences,
    apiKeySet: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5),
  };
}

export function updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
  const db = ensureDb();
  db.preferences = { ...db.preferences, ...updates };
  saveDb(db);
  return getPreferences();
}
