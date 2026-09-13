'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '@/types';
import { formatDate } from '@/lib/utils';
import CodeBlock from './CodeBlock';
import MoodIndicator from './MoodIndicator';
import MusicPlayerCard from '../music/MusicPlayerCard';
import { speakText, stopSpeaking } from '@/lib/audio/ttsEngine';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  User,
  Brain,
} from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  onRegenerate?: () => void;
  isStreaming?: boolean;
}

export default function MessageBubble({
  message,
  onRegenerate,
  isStreaming = false,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(message.content, {
        onEnd: () => setIsSpeaking(false),
      });
    }
  };

  return (
    <div
      className={`flex gap-3.5 py-4 px-3 sm:px-4 rounded-2xl transition-colors duration-200 group ${
        isAssistant
          ? 'bg-zinc-900/30 dark:bg-zinc-900/40 border border-zinc-800/40'
          : 'bg-indigo-600/5 dark:bg-indigo-950/20 border border-indigo-500/10'
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {isAssistant ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 ring-1 ring-white/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-300 shadow-md ring-1 ring-zinc-600">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-zinc-200">
              {isAssistant ? 'Aura' : 'You'}
            </span>
            <span className="text-[11px] text-zinc-500">
              {formatDate(message.timestamp)}
            </span>
          </div>

          {/* Mood Pill */}
          {message.detectedMood && (
            <MoodIndicator mood={message.detectedMood} />
          )}
        </div>

        {/* Attachment preview if user uploaded an image */}
        {message.attachment && (
          <div className="my-2 max-w-sm rounded-xl overflow-hidden border border-zinc-700">
            <img
              src={message.attachment.dataUrl}
              alt={message.attachment.name}
              className="w-full h-auto max-h-60 object-cover"
            />
          </div>
        )}

        {/* Markdown Content */}
        <div className="text-sm leading-relaxed text-zinc-200 break-words prose prose-invert prose-p:leading-relaxed prose-pre:my-0 max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match && !String(children).includes('\n');

                if (isInline) {
                  return (
                    <code className="px-1.5 py-0.5 rounded-md bg-zinc-800 text-indigo-300 font-mono text-xs border border-zinc-700/60" {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <CodeBlock
                    language={match ? match[1] : 'typescript'}
                    value={String(children).replace(/\n$/, '')}
                  />
                );
              },
              p({ children }) {
                return <p className="mb-2.5 last:mb-0">{children}</p>;
              },
              ul({ children }) {
                return <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>;
              },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-2 border-indigo-500 pl-3 py-1 italic my-2 bg-indigo-500/5 rounded-r-lg text-zinc-300">
                    {children}
                  </blockquote>
                );
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-3 rounded-xl border border-zinc-800">
                    <table className="min-w-full divide-y divide-zinc-800 text-xs text-left">
                      {children}
                    </table>
                  </div>
                );
              },
              th({ children }) {
                return <th className="px-3 py-2 bg-zinc-900 font-semibold text-zinc-300">{children}</th>;
              },
              td({ children }) {
                return <td className="px-3 py-2 border-t border-zinc-800/80">{children}</td>;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Music Player Card if this message contains synthesized song */}
        {message.songData && <MusicPlayerCard song={message.songData} />}

        {/* Used Memories Indicator */}
        {message.usedMemories && message.usedMemories.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-purple-400">
            <Brain className="w-3 h-3 text-purple-400" />
            <span className="italic">Remembered context: {message.usedMemories.join(', ')}</span>
          </div>
        )}

        {/* Action Toolbar */}
        {!isStreaming && (
          <div className="flex items-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              title="Copy response"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleToggleSpeak}
              className={`p-1.5 rounded-lg transition-colors ${
                isSpeaking
                  ? 'text-indigo-400 bg-indigo-500/20 animate-pulse'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
              title={isSpeaking ? 'Stop reading' : 'Read aloud with voice'}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {isAssistant && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                title="Regenerate response"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
