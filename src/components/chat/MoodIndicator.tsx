'use client';

import React from 'react';
import { MoodType } from '@/types';
import { MOOD_META } from '@/lib/utils';
import { HeartHandshake } from 'lucide-react';

interface MoodIndicatorProps {
  mood?: MoodType;
  showSupportTip?: boolean;
}

export default function MoodIndicator({ mood = 'neutral', showSupportTip = false }: MoodIndicatorProps) {
  const meta = MOOD_META[mood] || MOOD_META.neutral;

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${meta.bg} ${meta.color} ${meta.border} shadow-sm ${meta.glow} transition-all duration-300 select-none`}
        title={`Emotional Tone: ${meta.label}`}
      >
        <span className="text-sm">{meta.emoji}</span>
        <span>{meta.label}</span>
      </div>

      {showSupportTip && (mood === 'sad' || mood === 'stressed' || mood === 'lonely') && (
        <div className="mt-2 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200 flex items-start gap-2 animate-slide-up">
          <HeartHandshake className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sky-300">You're not alone ❤️</p>
            <p className="text-sky-200/80 text-[11px] mt-0.5">
              Take your time. If you ever feel in crisis, free 24/7 confidential help is available: Call/Text <strong>988</strong> (US/CA) or <strong>91-9820466726</strong> (India).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
