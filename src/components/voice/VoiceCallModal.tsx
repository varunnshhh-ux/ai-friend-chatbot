'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import AudioOrbVisualizer from './AudioOrbVisualizer';
import { createSpeechRecognizer, speakText, stopSpeaking, SpeechRecognitionWrapper } from '@/lib/audio/ttsEngine';
import { PersonaMode, MoodType } from '@/types';
import { PERSONA_META } from '@/lib/utils';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: PersonaMode;
  onSendMessage: (text: string) => Promise<string>;
}

export default function VoiceCallModal({
  isOpen,
  onClose,
  persona,
  onSendMessage,
}: VoiceCallModalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusText, setStatusText] = useState('Connected. Say something to Aura...');
  const [transcript, setTranscript] = useState('');
  const [lastAuraResponse, setLastAuraResponse] = useState('');
  const [callDuration, setCallDuration] = useState(0);

  const speechRecRef = useRef<SpeechRecognitionWrapper | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Call timer
  useEffect(() => {
    if (isOpen) {
      setCallDuration(0);
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  // Hands-free speech recognition loop
  useEffect(() => {
    if (!isOpen) return;

    speechRecRef.current = createSpeechRecognizer(
      async (spokenText, isFinal) => {
        if (isMuted) return;

        if (isFinal && spokenText.trim().length > 1) {
          setTranscript(spokenText);
          setIsListening(false);
          setStatusText('Aura is thinking...');

          try {
            const reply = await onSendMessage(spokenText);
            setLastAuraResponse(reply);
            setIsSpeaking(true);
            setStatusText('Aura is speaking...');

            speakText(reply, {
              onEnd: () => {
                setIsSpeaking(false);
                setStatusText('Listening to you...');
                setIsListening(true);
                speechRecRef.current?.start();
              },
            });
          } catch (err) {
            console.error('Voice call chat error:', err);
            setStatusText('Listening again...');
            setIsListening(true);
            speechRecRef.current?.start();
          }
        } else if (!isFinal) {
          setTranscript(spokenText);
        }
      },
      (err) => {
        console.warn('Voice rec error:', err);
      },
      () => {
        if (isOpen && !isSpeaking && !isMuted) {
          // Restart listening loop
          speechRecRef.current?.start();
        }
      }
    );

    speechRecRef.current.start();
    setIsListening(true);
    setStatusText('Listening to you...');

    return () => {
      speechRecRef.current?.stop();
      stopSpeaking();
    };
  }, [isOpen, isMuted, onSendMessage]);

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const personaMeta = PERSONA_META[persona] || PERSONA_META.friend;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-zinc-950/95 backdrop-blur-2xl text-white animate-fade-in select-none">
      {/* Top Bar */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm text-zinc-100 flex items-center gap-1.5">
              Aura Voice Call
              <span className="text-xs text-zinc-400 font-normal">({personaMeta.name})</span>
            </h3>
            <p className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {formatDuration(callDuration)}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            stopSpeaking();
            onClose();
          }}
          className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          title="Return to text chat"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Glowing Visualizer & Status */}
      <div className="flex flex-col items-center justify-center space-y-6 my-auto max-w-md text-center">
        <AudioOrbVisualizer isListening={isListening} isSpeaking={isSpeaking} />

        <div className="space-y-2">
          <p className="text-sm font-medium text-indigo-300 animate-pulse">
            {statusText}
          </p>

          {transcript && (
            <p className="text-xs text-zinc-400 italic max-w-xs mx-auto line-clamp-2">
              You: "{transcript}"
            </p>
          )}

          {lastAuraResponse && isSpeaking && (
            <p className="text-xs text-zinc-300 max-w-sm mx-auto line-clamp-3 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800">
              Aura: "{lastAuraResponse}"
            </p>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-xs flex items-center justify-center gap-6 pb-6">
        {/* Mute Mic Button */}
        <button
          onClick={() => {
            if (isMuted) {
              setIsMuted(false);
              speechRecRef.current?.start();
              setIsListening(true);
              setStatusText('Listening to you...');
            } else {
              setIsMuted(true);
              speechRecRef.current?.stop();
              setIsListening(false);
              setStatusText('Microphone muted.');
            }
          }}
          className={`p-4 rounded-full transition-all duration-200 ${
            isMuted
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
          title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* End Call Button */}
        <button
          onClick={() => {
            stopSpeaking();
            onClose();
          }}
          className="p-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-2xl shadow-rose-600/40 transition-all duration-200 active:scale-95"
          title="End Voice Call"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
