'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  Mic,
  MicOff,
  Image as ImageIcon,
  Music,
  X,
  Sparkles,
  Paperclip,
} from 'lucide-react';
import { PersonaMode } from '@/types';
import PersonaSelector from './PersonaSelector';
import { createSpeechRecognizer, SpeechRecognitionWrapper } from '@/lib/audio/ttsEngine';

interface ChatInputProps {
  onSendMessage: (
    content: string,
    attachment?: { name: string; type: string; dataUrl: string }
  ) => void;
  isStreaming: boolean;
  onStopGenerating: () => void;
  currentPersona: PersonaMode;
  onSelectPersona: (mode: PersonaMode) => void;
  onTriggerSingMode: () => void;
}

export default function ChatInput({
  onSendMessage,
  isStreaming,
  onStopGenerating,
  currentPersona,
  onSelectPersona,
  onTriggerSingMode,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [attachment, setAttachment] = useState<{
    name: string;
    type: string;
    dataUrl: string;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const speechRecRef = useRef<SpeechRecognitionWrapper | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  // Setup Speech Recognition
  useEffect(() => {
    speechRecRef.current = createSpeechRecognizer(
      (transcript, isFinal) => {
        if (isFinal) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setInterimTranscript('');
        } else {
          setInterimTranscript(transcript);
        }
      },
      (err) => {
        console.warn('Voice input error:', err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    return () => {
      speechRecRef.current?.stop();
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      speechRecRef.current?.stop();
      setIsRecording(false);
    } else {
      speechRecRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!input.trim() && !attachment) || isStreaming) return;

    onSendMessage(input.trim(), attachment || undefined);
    setInput('');
    setAttachment(null);
    if (isRecording) {
      speechRecRef.current?.stop();
      setIsRecording(false);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        name: file.name,
        type: file.type,
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-4">
      {/* Top toolbar */}
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <div className="flex items-center gap-2">
          <PersonaSelector
            currentPersona={currentPersona}
            onSelectPersona={onSelectPersona}
          />

          <button
            onClick={onTriggerSingMode}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium transition-all duration-200 active:scale-95 shadow-sm"
            title="Sing for Me - Mood Music Mode"
          >
            <Music className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Sing for Me</span>
          </button>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Listening...
          </div>
        )}
      </div>

      {/* Main Input Box */}
      <div className="relative rounded-2xl border border-zinc-700/60 bg-zinc-900/80 backdrop-blur-xl shadow-2xl transition-all duration-200 focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20">
        {/* Attachment preview */}
        {attachment && (
          <div className="p-3 border-b border-zinc-800 flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-zinc-700">
              <img
                src={attachment.dataUrl}
                alt="Attachment"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setAttachment(null)}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="text-xs text-zinc-400 truncate">
              <p className="font-medium text-zinc-200 truncate">{attachment.name}</p>
              <p className="text-[11px] text-zinc-500">Image attached</p>
            </div>
          </div>
        )}

        {/* Live speech interim pill */}
        {interimTranscript && (
          <div className="px-4 pt-2 text-xs text-indigo-400 italic">
            "{interimTranscript}..."
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message Aura in ${currentPersona} mode... (Press Enter to send, Shift+Enter for newline)`}
          rows={1}
          className="w-full px-4 pt-3.5 pb-12 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 resize-none outline-none leading-relaxed"
        />

        {/* Bottom controls inside textarea container */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Left tools */}
          <div className="flex items-center gap-1 pointer-events-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
              title="Attach an image"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
              }`}
              title={isRecording ? 'Stop listening' : 'Speak to Aura (Voice Input)'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Right Action (Send / Stop) */}
          <div className="pointer-events-auto">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopGenerating}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center gap-1.5 px-3 text-xs font-medium"
                title="Stop generating response"
              >
                <Square className="w-3.5 h-3.5 fill-current text-rose-400" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() && !attachment}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  input.trim() || attachment
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 active:scale-95'
                    : 'bg-zinc-800/60 text-zinc-600 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-[11px] text-zinc-500 mt-2">
        Aura is your personal AI companion & friend. Memories are stored locally.
      </p>
    </div>
  );
}
