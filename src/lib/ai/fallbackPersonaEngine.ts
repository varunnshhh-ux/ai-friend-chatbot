import { MemoryItem, MoodType, PersonaMode, SongComposition } from '@/types';

export interface PersonaResponse {
  content: string;
  detectedMood: MoodType;
  newMemories?: Omit<MemoryItem, 'id' | 'createdAt'>[];
  songData?: SongComposition;
}

export function generateFallbackPersonaResponse(
  userMessage: string,
  persona: PersonaMode,
  detectedMood: MoodType,
  memories: MemoryItem[],
  userName?: string
): PersonaResponse {
  const lower = userMessage.toLowerCase();
  const namePrefix = userName ? `${userName}, ` : '';

  // 1. Auto Memory Extraction Heuristics
  const newMemories: Omit<MemoryItem, 'id' | 'createdAt'>[] = [];
  const nameMatch = userMessage.match(/\b(?:my name is|i am|call me|naam hai)\s+([A-Za-z]+)\b/i);
  if (nameMatch && nameMatch[1]) {
    newMemories.push({
      category: 'fact',
      content: `User's name is ${nameMatch[1]}`,
      importance: 5,
      tags: ['name', 'identity'],
    });
  }

  const likeMatch = userMessage.match(/\b(?:i love|i like|i really enjoy|favorite is|fan of)\s+([^.,!]+)/i);
  if (likeMatch && likeMatch[1] && likeMatch[1].length < 60) {
    newMemories.push({
      category: 'preference',
      content: `Enjoys ${likeMatch[1].trim()}`,
      importance: 4,
      tags: ['likes', 'interests'],
    });
  }

  const goalMatch = userMessage.match(/\b(?:preparing for|working on|my goal is|studying for|want to become)\s+([^.,!]+)/i);
  if (goalMatch && goalMatch[1] && goalMatch[1].length < 60) {
    newMemories.push({
      category: 'goal',
      content: `Goal / Pursuit: ${goalMatch[1].trim()}`,
      importance: 5,
      tags: ['goal', 'career', 'study'],
    });
  }

  // 2. "Sing for Me" / Music Request detection
  if (
    lower.includes('sing') ||
    lower.includes('song') ||
    lower.includes('music') ||
    lower.includes('gana') ||
    lower.includes('gaana') ||
    lower.includes('chhota sa song') ||
    (detectedMood === 'sad' && (lower.includes('mood') || lower.includes('cheer me up')))
  ) {
    const isHindi = /mood|kharab|acha|sunao|chal|dard|thoda/i.test(lower);
    const song: SongComposition = {
      id: `song-${Date.now()}`,
      title: isHindi ? 'Roshni Ki Lehar (A Ray of Light)' : 'Clear Skies Ahead',
      mood: detectedMood,
      genre: detectedMood === 'sad' ? 'lofi' : 'uplifting',
      tempo: detectedMood === 'sad' ? 74 : 108,
      chords: ['Cmaj7', 'Am7', 'Dm7', 'G7'],
      lyrics: isHindi
        ? [
            'Dheere se dhalegi yeh raat bhi,',
            'Sitaron mein likhi hai nayi baat bhi.',
            'Hausla rakh mere dost tu yahan,',
            'Kal phir sajega yeh saara jahan ❤️',
          ]
        : [
            'Through the quiet dusk and steady rain,',
            'Every cloudy hour will fade again.',
            'Take a breath, my friend, and hold on tight,',
            'Tomorrow greets you with a warmer light ✨',
          ],
      emotionSummary: isHindi
        ? 'Ek sukoon bhari original lofi dhun tumhare dil ko sukoon dene ke liye.'
        : 'An original soothing acoustic melody crafted just for your current mood.',
      createdDate: new Date().toISOString(),
    };

    const songResponseContent = isHindi
      ? `Chal ${namePrefix}thoda mood better karte hain ❤️ 

Main tumhare liye ek chhota sa original song compose aur perform kar raha hoon:

🎵 **${song.title}**  
*Genre: ${song.genre.toUpperCase()} | Tempo: ${song.tempo} BPM*

> *"Dheere se dhalegi yeh raat bhi,*  
> *Sitaron mein likhi hai nayi baat bhi.*  
> *Hausla rakh mere dost tu yahan,*  
> *Kal phir sajega yeh saara jahan"*

Click below on the interactive player to listen to the melody and vocal performance! Main hamesha tumhare saath hoon. ✨`
      : `Hey ${namePrefix}let's lift your spirits up a bit ❤️

I've composed a special original melody and acoustic song just for you:

🎵 **${song.title}**  
*Genre: ${song.genre.toUpperCase()} | Tempo: ${song.tempo} BPM*

> *"Through the quiet dusk and steady rain,*  
> *Every cloudy hour will fade again.*  
> *Take a breath, my friend, and hold on tight,*  
> *Tomorrow greets you with a warmer light"*

Click the interactive player below to hear the melody synthesized live! Remember, bad days don't define your journey. I'm right here with you. ✨`;

    return {
      content: songResponseContent,
      detectedMood,
      newMemories,
      songData: song,
    };
  }

  // 3. Coding Persona responses
  if (persona === 'coding' || lower.includes('code') || lower.includes('function') || lower.includes('react') || lower.includes('typescript') || lower.includes('bug')) {
    return {
      content: `Here is a clean, robust, and production-ready solution for you:

\`\`\`typescript
// Production-grade implementation
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 500
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attempt - 1)));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}
\`\`\`

### Key Architectural Highlights:
1. **Exponential Backoff**: Prevents hammering endpoints under heavy load.
2. **Type Safety**: Fully generic (\`<T>\`) with explicit error propagation.
3. **Resilience**: Handles both network glitches and rate-limits gracefully.

Let me know if you want me to write unit tests or adapt this for your specific stack! 💻`,
      detectedMood,
      newMemories,
    };
  }

  // 4. Study Mode responses
  if (persona === 'study' || lower.includes('explain') || lower.includes('study') || lower.includes('concept') || lower.includes('how does')) {
    return {
      content: `Let's break this down into crystal-clear, memorable concepts! 📚

### 1. The Core Idea (In Plain English)
Think of this like a library system where instead of searching through thousands of shelves one by one, you have an indexed catalog that gives you the exact aisle in milliseconds.

### 2. How It Works Step-by-Step
- **Input Phase**: Data is received, sanitized, and tokenized into structured chunks.
- **Processing / Transformation**: The algorithm applies mathematical weights or rules to extract key relationships.
- **Output / Feedback Loop**: The final result is returned, and accuracy metrics determine if optimization is required.

### 3. Quick Memory Hook
> **Rule of Thumb**: *Simplify first, optimize second, and always test with edge cases.*

Would you like a quick 2-question quiz to test your recall on this? 🎯`,
      detectedMood,
      newMemories,
    };
  }

  // 5. Emotional Support & Distress
  if (detectedMood === 'sad' || detectedMood === 'stressed' || detectedMood === 'lonely') {
    return {
      content: `I hear you, ${namePrefix}and I'm really sorry you're feeling this way right now. 🫂

First, take a gentle breath. You don't have to carry everything all at once. Bad days and overwhelming feelings are heavy, but they don't mean you're failing. 

I'm right here with you. Do you want to talk about what happened, brainstorm a way through it together, or would you prefer a peaceful distraction or a song to help you unwind? ❤️

*(And remember: If things ever feel dangerously overwhelming, reaching out to someone you trust or a helpline like 988 is always a courageous and caring choice.)*`,
      detectedMood,
      newMemories,
    };
  }

  // 6. Excited Mood
  if (detectedMood === 'excited') {
    return {
      content: `YEEES! That is absolutely fantastic news! 🚀🎉

I am so hyped for you! You've been putting in the energy, and seeing it pay off is such a great feeling. Tell me all the details—what was the best moment so far? Let's celebrate this win! ✨🔥`,
      detectedMood,
      newMemories,
    };
  }

  // 7. General Friendly Default
  return {
    content: `Hey ${namePrefix}I'm so glad we're chatting! 🌟

${memories.length > 0 ? `I was just remembering our earlier context about your interest in *${memories[0].content}*—` : ''}I'm here for whatever you need today. Whether you want to explore a wild new idea, solve a tricky problem, dive into study topics, or just share what's on your mind—I'm listening.

What direction should we explore together? ✨`,
    detectedMood,
    newMemories,
  };
}
