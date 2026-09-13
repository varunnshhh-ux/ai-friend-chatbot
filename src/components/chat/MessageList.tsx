'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from '@/types';
import MessageBubble from './MessageBubble';
import SuggestedPrompts from './SuggestedPrompts';
import { ArrowDown, Sparkles } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingContent: string;
  onRegenerate: () => void;
  onSelectPrompt: (prompt: string) => void;
  userName?: string;
}

export default function MessageList({
  messages,
  isStreaming,
  streamingContent,
  onRegenerate,
  onSelectPrompt,
  userName,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, isStreaming]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 180;
    setShowScrollBottom(isFarFromBottom);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-2 sm:px-4 py-6 space-y-4 relative"
    >
      {messages.length === 0 ? (
        <SuggestedPrompts onSelectPrompt={onSelectPrompt} userName={userName} />
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <MessageBubble
              key={msg.id || index}
              message={msg}
              onRegenerate={
                index === messages.length - 1 && msg.role === 'assistant'
                  ? onRegenerate
                  : undefined
              }
            />
          ))}

          {/* Active Streaming Response Message */}
          {isStreaming && (
            <div className="flex gap-3.5 py-4 px-3 sm:px-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/40">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 ring-1 ring-white/20 shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-zinc-200">Aura</span>
                  <span className="text-[11px] text-indigo-400 animate-pulse">Thinking & crafting...</span>
                </div>
                {streamingContent ? (
                  <div className="text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap">
                    {streamingContent}
                    <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 py-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div ref={bottomRef} className="h-4" />

      {/* Floating Scroll to Bottom button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-28 right-8 p-3 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 shadow-2xl backdrop-blur-md transition-all duration-200 animate-bounce active:scale-95 z-30"
          title="Scroll to latest message"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
