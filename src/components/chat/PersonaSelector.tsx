'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PersonaMode } from '@/types';
import { PERSONA_META } from '@/lib/utils';
import { ChevronDown, Sparkles, Check } from 'lucide-react';

interface PersonaSelectorProps {
  currentPersona: PersonaMode;
  onSelectPersona: (mode: PersonaMode) => void;
}

export default function PersonaSelector({ currentPersona, onSelectPersona }: PersonaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const active = PERSONA_META[currentPersona] || PERSONA_META.friend;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-700/60 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-medium text-zinc-200 transition-all duration-200 shadow-sm hover:border-indigo-500/40 active:scale-95"
      >
        <span className="text-sm">{active.emoji}</span>
        <span className="font-semibold">{active.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl glass-dropdown shadow-2xl p-2 z-50 border border-zinc-700/70 animate-slide-up">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Select AI Companion Mode
          </div>
          <div className="mt-1 space-y-1 max-h-80 overflow-y-auto">
            {(Object.keys(PERSONA_META) as PersonaMode[]).map((mode) => {
              const meta = PERSONA_META[mode];
              const isSelected = currentPersona === mode;
              return (
                <button
                  key={mode}
                  onClick={() => {
                    onSelectPersona(mode);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-start gap-3 ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : 'hover:bg-zinc-800/70 text-zinc-300'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{meta.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-zinc-100">{meta.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-tight mt-0.5 line-clamp-2">
                      {meta.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
