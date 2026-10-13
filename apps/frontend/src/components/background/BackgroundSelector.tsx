import React from 'react';
import { X, Image as ImageIcon, Sliders } from 'lucide-react';
import type { Wallpaper, VisualSettings } from '../../types';
import { DEFAULT_WALLPAPERS } from '../../data/defaultWallpapers';

interface BackgroundSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VisualSettings;
  onUpdateSettings: (settings: Partial<VisualSettings>) => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel-modal border border-white/10 shadow-2xl p-6 md:p-8 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Kho hình nền 4K thư giãn</h2>
              <p className="text-xs text-slate-400">Tùy biến cảnh sắc và độ sáng theo mắt nhìn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wallpaper Grid */}
        <div className="mt-6">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">
            Chọn không gian tĩnh lặng
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 max-h-60 overflow-y-auto pr-1">
            {DEFAULT_WALLPAPERS.map((wp: Wallpaper) => {
              const isSelected = settings.currentWallpaperId === wp.id;
              return (
                <button
                  key={wp.id}
                  onClick={() => onUpdateSettings({ currentWallpaperId: wp.id })}
                  className={`group relative rounded-2xl overflow-hidden aspect-video border text-left transition-all ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/40 shadow-glow-amber scale-[1.02]'
                      : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'
                  }`}
                >
                  <img
                    src={wp.thumbnailUrl}
                    alt={wp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-2.5 flex items-end">
                    <span className="text-xs font-medium text-white line-clamp-1 drop-shadow">
                      {wp.title}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-slate-950 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Adjustments (Darkness & Blur) */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Darkness Overlay Slider */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-primary" /> Độ tối chống chói mắt
              </span>
              <span className="text-xs font-mono text-primary">{settings.darknessOverlay}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={settings.darknessOverlay}
              onChange={(e) => onUpdateSettings({ darknessOverlay: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          {/* Blur Amount Slider */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-tertiary" /> Độ mờ hậu cảnh (Blur)
              </span>
              <span className="text-xs font-mono text-tertiary">{settings.blurAmount}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={settings.blurAmount}
              onChange={(e) => onUpdateSettings({ blurAmount: Number(e.target.value) })}
              className="w-full accent-tertiary"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => onUpdateSettings({ darknessOverlay: 35, blurAmount: 0 })}
            className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
          >
            Khôi phục mặc định
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-amber-600 text-slate-950 font-semibold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
