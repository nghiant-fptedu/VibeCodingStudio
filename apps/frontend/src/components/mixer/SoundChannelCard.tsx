import React from 'react';
import {
  CloudRain,
  CloudLightning,
  Flame,
  Wind,
  Waves,
  Droplets,
  Bird,
  Coffee,
  Keyboard,
  Moon,
} from 'lucide-react';
import type { SoundChannel } from '../../types';

interface SoundChannelCardProps {
  channel: SoundChannel;
  onToggle: (id: string) => void;
  onVolumeChange: (id: string, vol: number) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  CloudRain,
  CloudLightning,
  Flame,
  Wind,
  Waves,
  Droplets,
  Bird,
  Coffee,
  Keyboard,
  Moon,
};

export const SoundChannelCard: React.FC<SoundChannelCardProps> = ({
  channel,
  onToggle,
  onVolumeChange,
}) => {
  const IconComponent = ICON_MAP[channel.icon] || Droplets;

  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all ${
        channel.isActive
          ? 'bg-surface-high/60 border-tertiary/40 shadow-glow-teal ring-1 ring-tertiary/20'
          : 'bg-white/[0.03] border-white/5 hover:border-white/15'
      }`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <button
          onClick={() => onToggle(channel.id)}
          className="flex items-center gap-2.5 text-left group"
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              channel.isActive
                ? 'bg-tertiary/20 text-tertiary shadow-glow-teal'
                : 'bg-white/5 text-slate-400 group-hover:text-white'
            }`}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <span
              className={`text-xs font-semibold block transition-colors ${
                channel.isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
              }`}
            >
              {channel.name}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {channel.isActive ? `${channel.volume}%` : 'Đang tắt'}
            </span>
          </div>
        </button>

        {/* Toggle Indicator Button */}
        <button
          onClick={() => onToggle(channel.id)}
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
            channel.isActive
              ? 'bg-tertiary text-slate-950 font-bold text-[10px]'
              : 'border border-white/20 hover:border-white/40'
          }`}
          aria-label={channel.isActive ? 'Tắt kênh' : 'Bật kênh'}
        >
          {channel.isActive && '✓'}
        </button>
      </div>

      {/* Volume Slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={channel.volume}
        disabled={!channel.isActive}
        onChange={(e) => onVolumeChange(channel.id, Number(e.target.value))}
        className={`w-full ${channel.isActive ? 'accent-tertiary' : 'opacity-30 cursor-not-allowed'}`}
        aria-label={`Âm lượng ${channel.name}`}
      />
    </div>
  );
};
