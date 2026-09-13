import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MoodType, PersonaMode } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function formatDate(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) {
      return 'Yesterday';
    }
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export const MOOD_META: Record<
  MoodType,
  { label: string; emoji: string; color: string; bg: string; border: string; glow: string }
> = {
  happy: {
    label: 'Joyful & Happy',
    emoji: '✨',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: 'shadow-amber-500/20',
  },
  excited: {
    label: 'Hyped & Excited',
    emoji: '🚀',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
  },
  sad: {
    label: 'Down / Vulnerable',
    emoji: '💙',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    glow: 'shadow-sky-500/20',
  },
  stressed: {
    label: 'Overwhelmed & Stressed',
    emoji: '🌿',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    glow: 'shadow-rose-500/20',
  },
  lonely: {
    label: 'Seeking Warmth',
    emoji: '🫂',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20',
  },
  angry: {
    label: 'Frustrated / Heated',
    emoji: '🔥',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/20',
  },
  confused: {
    label: 'Curious / Wondering',
    emoji: '💡',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    glow: 'shadow-indigo-500/20',
  },
  anxious: {
    label: 'Restless / Nervous',
    emoji: '🕊️',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/30',
    glow: 'shadow-teal-500/20',
  },
  neutral: {
    label: 'Calm & Steady',
    emoji: '💫',
    color: 'text-zinc-400',
    bg: 'bg-zinc-500/10',
    border: 'border-zinc-500/30',
    glow: 'shadow-zinc-500/20',
  },
};

export const PERSONA_META: Record<
  PersonaMode,
  { name: string; tag: string; description: string; emoji: string; badgeColor: string }
> = {
  friend: {
    name: 'Friend Mode',
    tag: 'Empathetic & Casual',
    description: 'A genuine, supportive friend who talks naturally, listens deeply, and cheers you up.',
    emoji: '🌟',
    badgeColor: 'from-violet-500 to-indigo-500',
  },
  study: {
    name: 'Study Guide',
    tag: 'Patient & Clear',
    description: 'Explains complex topics with intuitive analogies, structured summaries, and recall quizzes.',
    emoji: '📚',
    badgeColor: 'from-amber-500 to-orange-500',
  },
  coding: {
    name: 'Coding Buddy',
    tag: 'Senior Dev Pair',
    description: 'Writes production-clean code, explains architecture, debugs issues, and refactors.',
    emoji: '💻',
    badgeColor: 'from-emerald-500 to-teal-500',
  },
  career: {
    name: 'Career Mentor',
    tag: 'Strategic & Wise',
    description: 'Gives actionable advice on career growth, resumes, interviews, and life choices.',
    emoji: '💼',
    badgeColor: 'from-blue-500 to-cyan-500',
  },
  creative: {
    name: 'Creative Spark',
    tag: 'Inventive & Poetic',
    description: 'Brainstorms fresh ideas, crafts stories, writes poetry, and sparks imagination.',
    emoji: '🎨',
    badgeColor: 'from-pink-500 to-rose-500',
  },
  professional: {
    name: 'Executive / Serious',
    tag: 'Crisp & Objective',
    description: 'Delivers concise, high-signal, professional briefings without extra banter.',
    emoji: '👔',
    badgeColor: 'from-zinc-500 to-slate-600',
  },
};
