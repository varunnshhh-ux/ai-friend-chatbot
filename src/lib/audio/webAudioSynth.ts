import { SongComposition } from '@/types';

// Note frequencies map
const NOTE_FREQS: Record<string, number> = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
};

const CHORD_NOTES: Record<string, string[]> = {
  Cmaj7: ['C3', 'G3', 'B3', 'E4'],
  Am7: ['A3', 'E4', 'G4', 'C5'],
  Dm7: ['D3', 'A3', 'C4', 'F4'],
  G7: ['G3', 'D4', 'F4', 'B4'],
  Fmaj7: ['F3', 'C4', 'E4', 'A4'],
  Em7: ['E3', 'B3', 'D4', 'G4'],
};

export class AuraSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private analyser: AnalyserNode | null = null;
  private currentTimeout: NodeJS.Timeout | null = null;
  private onStateChange?: (playing: boolean, currentChordIndex: number) => void;

  constructor(onStateChange?: (playing: boolean, currentChordIndex: number) => void) {
    this.onStateChange = onStateChange;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public playTone(freq: number, duration = 0.6, type: OscillatorType = 'sine', volume = 0.15) {
    this.initContext();
    if (!this.ctx || !this.analyser) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, this.ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.analyser);

    osc.start();
    osc.stop(this.ctx.currentTime + duration + 0.05);
  }

  public async playSong(song: SongComposition, singLyrics = true): Promise<void> {
    this.initContext();
    this.stop();
    this.isPlaying = true;

    const chords = song.chords.length > 0 ? song.chords : ['Cmaj7', 'Am7', 'Dm7', 'G7'];
    const chordDuration = (60 / song.tempo) * 2; // 2 beats per chord

    // Play singing vocal synthesis if enabled
    if (singLyrics && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.singLyricsAlong(song.lyrics);
    }

    let chordIndex = 0;
    const playLoop = () => {
      if (!this.isPlaying) return;

      const chordName = chords[chordIndex % chords.length];
      const notes = CHORD_NOTES[chordName] || ['C3', 'E4', 'G4'];

      // Play chord pad
      notes.forEach((note, i) => {
        const freq = NOTE_FREQS[note] || 261.63;
        setTimeout(() => {
          if (this.isPlaying) {
            this.playTone(freq, chordDuration * 0.9, 'sine', 0.12);
          }
        }, i * 60);
      });

      // Play gentle arpeggio on top
      const arpeggioNotes = ['G4', 'E4', 'C5', 'B4', 'D5'];
      const arpFreq = NOTE_FREQS[arpeggioNotes[chordIndex % arpeggioNotes.length]] || 440;
      setTimeout(() => {
        if (this.isPlaying) {
          this.playTone(arpFreq, 0.4, 'triangle', 0.08);
        }
      }, chordDuration * 500);

      this.onStateChange?.(true, chordIndex % chords.length);

      chordIndex++;
      if (chordIndex < chords.length * 3 && this.isPlaying) {
        this.currentTimeout = setTimeout(playLoop, chordDuration * 1000);
      } else {
        this.stop();
      }
    };

    playLoop();
  }

  private singLyricsAlong(lyrics: string[]) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const fullText = lyrics.join('. ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.88;
    utterance.pitch = 1.15;

    // Pick gentle voice if available
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(
      (v) =>
        v.name.includes('Google') ||
        v.name.includes('Natural') ||
        v.name.includes('Samantha') ||
        v.lang.startsWith('en')
    );
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    this.isPlaying = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.onStateChange?.(false, 0);
  }

  public getPlayingState() {
    return this.isPlaying;
  }
}
