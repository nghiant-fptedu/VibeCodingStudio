export interface DefaultTrackSeed {
  title: string;
  curator: string;
  videoId: string;
  category: string;
  isCustom: boolean;
  order: number;
}

export const DEFAULT_TRACKS: DefaultTrackSeed[] = [
  {
    title: '1 A.M Study Session 📚 [lofi hip hop]',
    curator: 'Lofi Girl',
    videoId: 'lTRiuFIWV54',
    category: 'lofi',
    isCustom: false,
    order: 0,
  },
  {
    title: 'code-fi / lofi beats to code/relax to',
    curator: 'The AMP Channel',
    videoId: 'f02mOEt11OQ',
    category: 'lofi',
    isCustom: false,
    order: 1,
  },
  {
    title: 'Chillhop Radio · jazzy & lofi hip hop',
    curator: 'Chillhop Music',
    videoId: '5yx6BWlEVcY',
    category: 'lofi',
    isCustom: false,
    order: 2,
  },
  {
    title: '4 A.M Study Session 💤 [lofi hip hop]',
    curator: 'Lofi Girl',
    videoId: 'TURbeWK2wwg',
    category: 'lofi',
    isCustom: false,
    order: 3,
  },
  {
    title: 'lofi hip hop radio · beats to relax/study to',
    curator: 'College Music',
    videoId: 'MCkTebktHVc',
    category: 'lofi',
    isCustom: false,
    order: 4,
  },
  {
    title: 'Relaxing Jazz Piano Radio · Slow Jazz Music',
    curator: 'Cafe Music BGM channel',
    videoId: 'Dx5qFachd3A',
    category: 'piano',
    isCustom: false,
    order: 5,
  },
];
