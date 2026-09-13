export type PersonaMode =
  | 'friend'
  | 'study'
  | 'coding'
  | 'career'
  | 'creative'
  | 'professional';

export type MoodType =
  | 'happy'
  | 'sad'
  | 'stressed'
  | 'lonely'
  | 'angry'
  | 'excited'
  | 'confused'
  | 'anxious'
  | 'neutral';

export type MemoryCategory =
  | 'preference'
  | 'interest'
  | 'goal'
  | 'fact'
  | 'relationship'
  | 'habit';

export interface MemoryItem {
  id: string;
  category: MemoryCategory;
  content: string;
  importance: number; // 1 to 5
  createdAt: string;
  lastUsedAt?: string;
  tags: string[];
}

export interface SongComposition {
  id: string;
  title: string;
  mood: MoodType;
  genre: 'lofi' | 'acoustic' | 'synthwave' | 'chillhop' | 'uplifting';
  tempo: number; // BPM
  chords: string[];
  lyrics: string[];
  emotionSummary: string;
  melodyNotes?: string[];
  createdDate: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  detectedMood?: MoodType;
  usedMemories?: string[];
  songData?: SongComposition;
  attachment?: {
    name: string;
    type: string;
    dataUrl: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  persona: PersonaMode;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  messageCount?: number;
  lastMood?: MoodType;
}

export interface UserPreferences {
  userName?: string;
  preferredVoice?: string;
  voiceSpeed?: number;
  voicePitch?: number;
  autoSpeakResponse?: boolean;
  theme?: 'dark' | 'light' | 'obsidian' | 'aurora';
  defaultPersona?: PersonaMode;
  apiKeySet?: boolean;
}
