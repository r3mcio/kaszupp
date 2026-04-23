// ─── Types ────────────────────────────────────────────────────────────────────

export type Lang = 'pl' | 'en';

export interface LocalizedString {
  pl: string;
  en: string;
}

export interface VideoDemo {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  /** Full YouTube watch URL or youtu.be short link — react-player handles both */
  videoUrl: LocalizedString;
}

// ─── Mock data — replace videoUrl values with real YouTube links ──────────────

export const videoDemos: VideoDemo[] = [
  {
    id: 'commercial',
    title: {
      pl: 'Demo Reklamowe',
      en: 'Commercial Demo',
    },
    subtitle: {
      pl: 'Spot reklamowy · dubbing · voiceover',
      en: 'Advertising spot · dubbing · voiceover',
    },
    videoUrl: {
      pl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      en: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  },
  {
    id: 'narration',
    title: {
      pl: 'Demo Narracyjne',
      en: 'Narration Demo',
    },
    subtitle: {
      pl: 'Audiobooki · dokumenty · e-learning',
      en: 'Audiobooks · documentaries · e-learning',
    },
    videoUrl: {
      pl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      en: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  },
  {
    id: 'character',
    title: {
      pl: 'Demo Postaci',
      en: 'Character Demo',
    },
    subtitle: {
      pl: 'Animacje · gry · bajki',
      en: 'Animation · games · cartoons',
    },
    videoUrl: {
      pl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      en: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  },
];
