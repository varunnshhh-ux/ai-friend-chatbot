'use client';

import React from 'react';
import { Sparkles, MessageCircleHeart, BookOpen, Code2, Briefcase, Music, Smile } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  userName?: string;
}

export default function SuggestedPrompts({ onSelectPrompt, userName }: SuggestedPromptsProps) {
  const suggestions = [
    {
      icon: <MessageCircleHeart className="w-4 h-4 text-violet-400" />,
      title: 'Talk to me',
      subtitle: "Just wanted to share how my day went...",
      prompt: "Hey Aura! Just wanted to talk and share how my day went. How are you doing today?",
      bg: 'hover:border-violet-500/50 hover:bg-violet-500/5',
    },
    {
      icon: <Music className="w-4 h-4 text-rose-400" />,
      title: 'Sing for me',
      subtitle: 'Compose a short song for my mood',
      prompt: 'Mera mood thoda low hai. Can you sing and perform a short original song for me?',
      bg: 'hover:border-rose-500/50 hover:bg-rose-500/5',
    },
    {
      icon: <BookOpen className="w-4 h-4 text-amber-400" />,
      title: 'Help me study',
      subtitle: 'Explain a tough topic simply',
      prompt: 'Can you help me study? Explain how neural networks or recursion work with simple analogies.',
      bg: 'hover:border-amber-500/50 hover:bg-amber-500/5',
    },
    {
      icon: <Code2 className="w-4 h-4 text-emerald-400" />,
      title: 'Help me code',
      subtitle: 'Write or review clean code',
      prompt: 'Let’s write code together! How do I implement a debounced search hook in React with TypeScript?',
      bg: 'hover:border-emerald-500/50 hover:bg-emerald-500/5',
    },
    {
      icon: <Smile className="w-4 h-4 text-sky-400" />,
      title: "I'm feeling low",
      subtitle: 'Need some warmth and advice',
      prompt: "I'm feeling a bit overwhelmed and stressed today. Can we talk?",
      bg: 'hover:border-sky-500/50 hover:bg-sky-500/5',
    },
    {
      icon: <Briefcase className="w-4 h-4 text-cyan-400" />,
      title: 'Career & Brainstorm',
      subtitle: 'Give me strategic guidance',
      prompt: 'I want to brainstorm next steps for my engineering career and build impactful portfolio projects.',
      bg: 'hover:border-cyan-500/50 hover:bg-cyan-500/5',
    },
  ];

  const greeting = userName ? `Hey ${userName}!` : 'Hey friend!';

  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto px-4 py-8 text-center animate-slide-up">
      {/* Hero Glowing Orb / Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500 p-0.5 shadow-2xl shadow-indigo-500/30 animate-float">
          <div className="w-full h-full rounded-[22px] bg-zinc-950/90 flex items-center justify-center backdrop-blur-md">
            <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl -z-10" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-zinc-100 tracking-tight">
        {greeting} I'm <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400 bg-clip-text text-transparent">Aura</span>.
      </h2>
      <p className="text-zinc-400 text-sm sm:text-base max-w-md mt-2 leading-relaxed">
        Your personal AI companion, friend, and guide. Talk to me naturally about anything.
      </p>

      {/* Suggested Prompt Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full mt-8">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className={`p-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 text-left transition-all duration-200 ${item.bg} group active:scale-[0.98] shadow-sm flex flex-col justify-between`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-zinc-800/70 group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>
              <span className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                {item.title}
              </span>
            </div>
            <p className="text-[12px] text-zinc-400 leading-snug line-clamp-2">
              {item.subtitle}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
