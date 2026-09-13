'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music, Disc3, Mic2, Sparkles, Volume2 } from 'lucide-react';
import { SongComposition } from '@/types';
import { AuraSynthesizer } from '@/lib/audio/webAudioSynth';
import WaveformVisualizer from './WaveformVisualizer';
import { MOOD_META } from '@/lib/utils';

interface MusicPlayerCardProps {
  song: SongComposition;
}

export default function MusicPlayerCard({ song }: MusicPlayerCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [singLyrics, setSingLyrics] = useState(true);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const synthRef = useRef<AuraSynthesizer | null>(null);

  useEffect(() => {
    synthRef.current = new AuraSynthesizer((playing, chordIdx) => {
      setIsPlaying(playing);
      setCurrentChordIndex(chordIdx);
    });

    return () => {
      synthRef.current?.stop();
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      synthRef.current?.stop();
      setIsPlaying(false);
    } else {
      synthRef.current?.playSong(song, singLyrics);
      setIsPlaying(true);
    }
  };

  const moodMeta = MOOD_META[song.mood] || MOOD_META.neutral;

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-zinc-950/60 backdrop-blur-xl p-5 shadow-2xl transition-all duration-300 hover:border-indigo-500/50">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 animate-pulse">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-zinc-100 text-base">{song.title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${moodMeta.bg} ${moodMeta.color} ${moodMeta.border} font-medium`}>
                {moodMeta.emoji} {song.genre.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{song.emotionSummary}</p>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="relative group p-3 rounded-full bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-500 hover:to-rose-500 text-white shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center"
          title={isPlaying ? 'Pause Melody' : 'Play Melody & Vocals'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Waveform Visualizer */}
      <div className="mb-4">
        <WaveformVisualizer isPlaying={isPlaying} analyser={synthRef.current?.getAnalyser()} colorTheme="#8b5cf6" />
      </div>

      {/* Chords Sequence Tracker */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
          <Disc3 className="w-3.5 h-3.5 text-indigo-400" />
          Chords:
        </span>
        {song.chords.map((chord, idx) => (
          <span
            key={idx}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
              isPlaying && currentChordIndex === idx
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/40 scale-105 ring-1 ring-white/40'
                : 'bg-zinc-800/70 text-zinc-300 border border-zinc-700/50'
            }`}
          >
            {chord}
          </span>
        ))}
        <span className="text-xs text-zinc-400 ml-auto font-mono">
          {song.tempo} BPM
        </span>
      </div>

      {/* Lyrics Box */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-3.5 text-xs text-zinc-300 space-y-1.5">
        <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Original Poetic Lyrics
          </span>
          <button
            onClick={() => setSingLyrics(!singLyrics)}
            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-all duration-150 ${
              singLyrics ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            <Mic2 className="w-3 h-3" />
            {singLyrics ? 'Singing Vocals: ON' : 'Singing Vocals: OFF'}
          </button>
        </div>
        <div className="italic leading-relaxed pt-1 text-zinc-200 space-y-1">
          {song.lyrics.map((line, idx) => (
            <p key={idx}>"{line}"</p>
          ))}
        </div>
      </div>
    </div>
  );
}
