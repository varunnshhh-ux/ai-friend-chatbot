import { MoodType } from '@/types';

export function detectMood(text: string): MoodType {
  const lower = text.toLowerCase();

  // Sad / Low
  if (
    /\b(sad|depressed|unhappy|crying|tears|heartbroken|down|gloomy|lonely|empty|miss (him|her|them)|hopeless|painful|feeling low|mood kharab|udas|rona|dard)\b/.test(
      lower
    )
  ) {
    if (/\b(lonely|alone|nobody to talk to|koi nahi hai)\b/.test(lower)) {
      return 'lonely';
    }
    return 'sad';
  }

  // Stressed / Overwhelmed
  if (
    /\b(stressed|burnout|overwhelmed|exhausted|too much work|pressure|deadline|can't cope|panicking|headache|tension|pareshan|dimag kharab)\b/.test(
      lower
    )
  ) {
    return 'stressed';
  }

  // Angry / Frustrated
  if (
    /\b(angry|furious|annoyed|irritated|mad|hate this|idiot|pissed|rage|gussa|bakwas)\b/.test(
      lower
    )
  ) {
    return 'angry';
  }

  // Excited / Hyped
  if (
    /\b(excited|yay|hurray|omg|let's go|awesome|amazing|fantastic|super happy|celebrate|won|passed|promoted|crushed it|party|khushi|mazza)\b/.test(
      lower
    ) ||
    /(!{2,}|\b(wow|wohoo)\b)/.test(lower)
  ) {
    return 'excited';
  }

  // Anxious / Nervous
  if (
    /\b(anxious|nervous|scared|fear|worried|dreading|shaking|interview tomorrow|exam tomorrow|darr|ghabrahat)\b/.test(
      lower
    )
  ) {
    return 'anxious';
  }

  // Confused / Inquiring
  if (
    /\b(confused|don't understand|how does|what is|why is|explain|stuck|lost|batao|samajh nahi aaya)\b/.test(
      lower
    ) ||
    /(\?{2,})/.test(lower)
  ) {
    return 'confused';
  }

  // Happy / Good
  if (
    /\b(happy|great|good day|feeling good|blessed|cheerful|smiling|love|enjoying|accha|shandaar)\b/.test(
      lower
    )
  ) {
    return 'happy';
  }

  return 'neutral';
}
