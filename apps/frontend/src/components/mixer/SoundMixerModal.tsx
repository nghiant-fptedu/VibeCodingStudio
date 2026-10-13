import React from 'react';
import { X, Sliders, VolumeX, Sparkles } from 'lucide-react';
import type { SoundChannel, SoundPreset } from '../../types';
import { SoundChannelCard } from './SoundChannelCard';
import { useI18n } from '../../context/I18nContext';

interface SoundMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: SoundChannel[];
  presets: SoundPreset[];
  activeCount: number;
  onToggleChannel: (id: string) => void;
  onUpdateVolume: (id: string, vol: number) => void;
  onApplyPreset: (preset: SoundPreset) => void;
  onMuteAll: () => void;
}

export const SoundMixerModal: React.FC<SoundMixerModalProps> = ({
  isOpen,
  onClose,
  channels,
  presets,
  activeCount,
  onToggleChannel,
  onUpdateVolume,
  onApplyPreset,
  onMuteAll,
}) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl glass-panel-modal border border-white/10 shadow-2xl p-6 md:p-8 overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary/20 border border-tertiary/30 flex items-center justify-center text-tertiary shadow-glow-teal">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  {t.mixer.title}
                </h2>
                {activeCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-tertiary/20 text-tertiary font-bold text-xs">
                    {activeCount} {t.mixer.activeCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {t.mixer.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                onClick={onMuteAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-xs text-slate-300 hover:text-white border border-white/10 transition-all"
                title={t.mixer.muteAllBtn}
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.mixer.muteAllBtn}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="mt-5 overflow-y-auto pr-1 flex-1">
          {/* Preset Combos */}
          <div className="mb-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> {t.mixer.presetsTitle}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {presets.map((preset: SoundPreset) => {
                const localizedName = t.mixer.presets[preset.id]?.name || preset.name;
                const localizedDesc = t.mixer.presets[preset.id]?.description || preset.description;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onApplyPreset(preset)}
                    className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-primary/40 text-left transition-all group active:scale-95"
                  >
                    <span className="text-xs font-bold text-white block group-hover:text-primary transition-colors">
                      {localizedName}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {localizedDesc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 10 Sound Channels Grid */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              {t.mixer.channelsTitle}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {channels.map((channel: SoundChannel) => (
                <SoundChannelCard
                  key={channel.id}
                  channel={channel}
                  onToggle={onToggleChannel}
                  onVolumeChange={onUpdateVolume}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-tertiary to-teal-600 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            {t.mixer.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
