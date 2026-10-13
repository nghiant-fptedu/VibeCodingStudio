import type { SoundChannel, SoundPreset } from '../types';

export const INITIAL_SOUND_CHANNELS: SoundChannel[] = [
  {
    id: 'rain',
    name: 'Mưa rào',
    icon: 'CloudRain',
    audioSrc: 'rain',
    volume: 50,
    isActive: false,
  },
  {
    id: 'thunder',
    name: 'Sấm chớp',
    icon: 'CloudLightning',
    audioSrc: 'thunder',
    volume: 35,
    isActive: false,
  },
  {
    id: 'campfire',
    name: 'Lửa trại',
    icon: 'Flame',
    audioSrc: 'campfire',
    volume: 55,
    isActive: false,
  },
  {
    id: 'wind',
    name: 'Gió thoảng',
    icon: 'Wind',
    audioSrc: 'wind',
    volume: 40,
    isActive: false,
  },
  {
    id: 'waves',
    name: 'Sóng biển',
    icon: 'Waves',
    audioSrc: 'waves',
    volume: 50,
    isActive: false,
  },
  {
    id: 'stream',
    name: 'Suối rừng',
    icon: 'Droplets',
    audioSrc: 'stream',
    volume: 45,
    isActive: false,
  },
  {
    id: 'birds',
    name: 'Chim hót',
    icon: 'Bird',
    audioSrc: 'birds',
    volume: 40,
    isActive: false,
  },
  {
    id: 'cafe',
    name: 'Quán cafe',
    icon: 'Coffee',
    audioSrc: 'cafe',
    volume: 45,
    isActive: false,
  },
  {
    id: 'keyboard',
    name: 'Bàn phím cơ',
    icon: 'Keyboard',
    audioSrc: 'keyboard',
    volume: 40,
    isActive: false,
  },
  {
    id: 'crickets',
    name: 'Dế đêm',
    icon: 'Moon',
    audioSrc: 'crickets',
    volume: 35,
    isActive: false,
  },
];

export const PRESET_COMBOS: SoundPreset[] = [
  {
    id: 'stormy-night',
    name: 'Đêm mưa bão',
    description: 'Mưa rào nặng hạt kết hợp tiếng sấm xa và gió rít',
    channels: {
      rain: 65,
      thunder: 45,
      wind: 30,
    },
  },
  {
    id: 'cozy-fireplace',
    name: 'Nhà gỗ mùa đông',
    description: 'Bếp lửa ấm cúng với tiếng gió và mưa lất phất ngoài hiên',
    channels: {
      campfire: 60,
      wind: 25,
      rain: 20,
    },
  },
  {
    id: 'coffee-shop',
    name: 'Góc quán cafe',
    description: 'Không khí quán quen với tiếng gõ phím và mưa rơi nhẹ',
    channels: {
      cafe: 55,
      keyboard: 45,
      rain: 25,
    },
  },
  {
    id: 'forest-dawn',
    name: 'Bình minh trong rừng',
    description: 'Tiếng chim hót sớm, suối chảy róc rách và gió nhẹ qua tán cây',
    channels: {
      birds: 60,
      stream: 45,
      wind: 25,
    },
  },
];
