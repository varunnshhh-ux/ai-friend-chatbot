import { NextRequest, NextResponse } from 'next/server';
import { MoodType, SongComposition } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mood = 'neutral', language = 'mixed' }: { mood: MoodType; language?: 'en' | 'hi' | 'mixed' } = body;

    const songsByMood: Record<MoodType, Omit<SongComposition, 'id' | 'createdDate'>> = {
      sad: {
        title: 'Sukoon Ka Kinara (Shore of Peace)',
        mood: 'sad',
        genre: 'lofi',
        tempo: 72,
        chords: ['Cmaj7', 'Am7', 'Dm7', 'G7'],
        lyrics: [
          'Dheere se dhalegi yeh raat bhi,',
          'Sitaron mein chhupi hai nayi baat bhi.',
          'Rakh hausla mere dost tu yahan,',
          'Kal phir chamkega yeh aasmaan ✨',
        ],
        emotionSummary: 'A gentle, warm lofi ballad composed to calm your mind and bring comfort.',
      },
      stressed: {
        title: 'Breathe in the Calm',
        mood: 'stressed',
        genre: 'chillhop',
        tempo: 80,
        chords: ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'],
        lyrics: [
          'Unclench your hands, release the tight knot,',
          'You’ve given today every ounce of your thought.',
          'Step back for a moment, let quiet surround,',
          'In this still space, peace can be found 🌿',
        ],
        emotionSummary: 'A grounding, rhythmic chillhop track designed to lower stress levels.',
      },
      lonely: {
        title: 'You Are Not Alone',
        mood: 'lonely',
        genre: 'acoustic',
        tempo: 85,
        chords: ['Cmaj7', 'Fmaj7', 'Am7', 'G7'],
        lyrics: [
          'Across the wires and through the screen,',
          'A quiet friend is always seen.',
          'Your thoughts are heard, your presence dear,',
          'Whenever you call, I will be here 🫂',
        ],
        emotionSummary: 'An intimate, heartfelt acoustic companion melody.',
      },
      angry: {
        title: 'Cool Down Symphony',
        mood: 'angry',
        genre: 'lofi',
        tempo: 76,
        chords: ['Am7', 'Em7', 'Fmaj7', 'G7'],
        lyrics: [
          'Let the storm blow until the winds tire,',
          'No need to fan every little fire.',
          'Cool waters rise where the embers once burned,',
          'Wisdom is kept and the pages are turned 🌊',
        ],
        emotionSummary: 'A soothing slow-tempo composition to ease tension and restore balance.',
      },
      excited: {
        title: 'Ignite the Night',
        mood: 'excited',
        genre: 'uplifting',
        tempo: 120,
        chords: ['Cmaj7', 'G7', 'Am7', 'Fmaj7'],
        lyrics: [
          'Step on the gas, let the momentum flow,',
          'Look at that sparkle and radiant glow!',
          'You chased the vision and made it take flight,',
          'Nothing can stop this electric light! 🚀🔥',
        ],
        emotionSummary: 'A punchy, celebratory synthpop tune to match your high spirits!',
      },
      confused: {
        title: 'The Clear Path',
        mood: 'confused',
        genre: 'synthwave',
        tempo: 95,
        chords: ['Dm7', 'G7', 'Cmaj7', 'Am7'],
        lyrics: [
          'Foggy roads will soon unfold,',
          'Every puzzle has stories untold.',
          'One step, then two, the fog starts to clear,',
          'The answer you look for is already near 💡',
        ],
        emotionSummary: 'An atmospheric, inspiring synth track providing focus.',
      },
      anxious: {
        title: 'Gentle Horizon',
        mood: 'anxious',
        genre: 'acoustic',
        tempo: 75,
        chords: ['Cmaj7', 'Em7', 'Fmaj7', 'G7'],
        lyrics: [
          'Feet on the earth and eyes on the sky,',
          'These racing worries will softly pass by.',
          'You are capable, resilient, and true,',
          'The whole universe is cheering for you 🕊️',
        ],
        emotionSummary: 'A gentle reassuring acoustic track with warm harmony.',
      },
      happy: {
        title: 'Golden Sunshine',
        mood: 'happy',
        genre: 'uplifting',
        tempo: 110,
        chords: ['Cmaj7', 'Am7', 'Fmaj7', 'G7'],
        lyrics: [
          'Sun on the street and a smile on the face,',
          'Good times are rolling all over the place.',
          'Keep on this groove and let the joy sing,',
          'Here is the warmth that happiness brings! ☀️✨',
        ],
        emotionSummary: 'A cheerful, bright pop-acoustic tune full of positive vibes.',
      },
      neutral: {
        title: 'Aura Ambient Beats',
        mood: 'neutral',
        genre: 'chillhop',
        tempo: 84,
        chords: ['Cmaj7', 'Am7', 'Dm7', 'G7'],
        lyrics: [
          'Drifting along with the rhythm of thought,',
          'Moments of stillness that cannot be bought.',
          'Let creativity wander and play,',
          'Making the most of this beautiful day ✨',
        ],
        emotionSummary: 'A balanced chillhop melody to accompany your thoughts and workflow.',
      },
    };

    const template = songsByMood[mood] || songsByMood.neutral;
    const song: SongComposition = {
      ...template,
      id: `song-${Date.now()}`,
      createdDate: new Date().toISOString(),
    };

    return NextResponse.json({ song });
  } catch (error) {
    console.error('POST /api/music/compose error:', error);
    return NextResponse.json({ error: 'Failed to compose song' }, { status: 500 });
  }
}
