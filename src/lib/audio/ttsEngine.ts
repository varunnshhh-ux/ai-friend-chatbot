// Speech Synthesis & Recognition Helpers

export interface VoiceOption {
  name: string;
  lang: string;
  isDefault?: boolean;
}

export function getAvailableVoices(): VoiceOption[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  return voices.map((v) => ({
    name: v.name,
    lang: v.lang,
    isDefault: v.default,
  }));
}

export function speakText(
  text: string,
  options?: {
    voiceName?: string;
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
  }
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel(); // Stop prior speech

  // Strip code blocks and markdown symbols for cleaner listening experience
  const sanitized = text
    .replace(/```[\s\S]*?```/g, 'Code snippet provided in chat.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*#_~>]/g, '')
    .trim();

  if (!sanitized) return;

  const utterance = new SpeechSynthesisUtterance(sanitized);
  utterance.rate = options?.rate || 1.0;
  utterance.pitch = options?.pitch || 1.0;

  if (options?.voiceName) {
    const voices = window.speechSynthesis.getVoices();
    const found = voices.find((v) => v.name === options.voiceName);
    if (found) utterance.voice = found;
  }

  if (options?.onEnd) {
    utterance.onend = options.onEnd;
    utterance.onerror = options.onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Web Speech Recognition
export interface SpeechRecognitionWrapper {
  start: () => void;
  stop: () => void;
  isSupported: boolean;
}

export function createSpeechRecognizer(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError?: (err: unknown) => void,
  onEnd?: () => void
): SpeechRecognitionWrapper {
  if (typeof window === 'undefined') {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRec) {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const recognizer = new SpeechRec();
  recognizer.continuous = true;
  recognizer.interimResults = true;
  recognizer.lang = 'en-US';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognizer.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    if (final) {
      onResult(final, true);
    } else if (interim) {
      onResult(interim, false);
    }
  };

  recognizer.onerror = (err: unknown) => {
    if (onError) onError(err);
  };

  recognizer.onend = () => {
    if (onEnd) onEnd();
  };

  return {
    start: () => {
      try {
        recognizer.start();
      } catch (e) {
        console.warn('Speech recognition already started or error:', e);
      }
    },
    stop: () => {
      try {
        recognizer.stop();
      } catch (e) {
        console.warn('Speech recognition stop error:', e);
      }
    },
    isSupported: true,
  };
}
