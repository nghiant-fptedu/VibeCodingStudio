import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Image as ImageIcon,
  Sliders,
  CheckSquare,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Languages,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';

interface HeaderProps {
  onOpenWallpaperModal: () => void;
  onOpenMixerModal: () => void;
  onOpenTodoDrawer: () => void;
  onToggleZenMode: () => void;
  isMuted: boolean;
  onToggleMasterMute: () => void;
  todoProgressPercent: number;
  mixerActiveCount: number;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenWallpaperModal,
  onOpenMixerModal,
  onOpenTodoDrawer,
  onToggleZenMode,
  isMuted,
  onToggleMasterMute,
  todoProgressPercent,
  mixerActiveCount,
  onSignOut,
}) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { language, toggleLanguage, t } = useI18n();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Brand & Quote */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl glass-panel border border-white/10 shadow-lg">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-glow-amber">
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-primary-light bg-clip-text text-transparent">
            VibeSpace
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle text-xs text-slate-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
          <span>{t.header.slogan}</span>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2 md:gap-2.5">
        {/* Language Switcher Pill */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass-panel border border-white/15 hover:border-white/30 text-xs font-semibold transition-all hover:bg-white/10 active:scale-95"
          title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
        >
          <Languages className="w-3.5 h-3.5 text-primary" />
          <span className={language === 'vi' ? 'text-primary font-bold' : 'text-slate-400'}>VI</span>
          <span className="text-slate-600">/</span>
          <span className={language === 'en' ? 'text-primary font-bold' : 'text-slate-400'}>EN</span>
        </button>

        {/* White Noise Mixer Button */}
        <button
          onClick={onOpenMixerModal}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            mixerActiveCount > 0
              ? 'glass-panel border-tertiary/50 text-tertiary shadow-glow-teal'
              : 'glass-panel-subtle border-white/10 text-slate-300 hover:text-white hover:border-white/20'
          }`}
          title={t.header.soundMixerTitle}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.header.soundMixer}</span>
          {mixerActiveCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-tertiary text-slate-950 font-bold text-[10px] flex items-center justify-center">
              {mixerActiveCount}
            </span>
          )}
        </button>

        {/* Todo Drawer Button */}
        <button
          onClick={onOpenTodoDrawer}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-white/25 text-xs font-medium transition-all"
          title={t.header.todoListTitle}
        >
          <CheckSquare className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">{t.header.todoList}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary-light text-[10px] font-bold">
            {todoProgressPercent}%
          </span>
        </button>

        {/* Wallpaper Selector Button */}
        <button
          onClick={onOpenWallpaperModal}
          className="w-9 h-9 rounded-full flex items-center justify-center glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-white/25 transition-all"
          title={t.header.wallpaper}
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Master Mute Button */}
        <button
          onClick={onToggleMasterMute}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
            isMuted
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
              : 'glass-panel border-white/10 text-slate-300 hover:text-white hover:border-white/25'
          }`}
          title={isMuted ? t.header.unmuteAll : t.header.muteAll}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* User Auth Section */}
        {isAuthenticated && user ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full glass-panel border border-white/15 hover:border-white/30 text-white text-xs font-medium transition-all"
              title={user.name}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shadow-glow-amber">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="max-w-[80px] sm:max-w-[120px] truncate">{user.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-white/15 p-2 shadow-2xl shadow-black/80 text-xs animate-fade-in z-50">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t.header.cloudSynced}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onSignOut?.();
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-300 hover:bg-rose-500/15 transition-colors font-medium text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.header.logout}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-white/15 hover:border-primary/50 text-slate-200 hover:text-white text-xs font-semibold transition-all hover:shadow-glow-amber"
            title={t.header.loginTitle}
          >
            <UserIcon className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">{t.header.login}</span>
          </button>
        )}

        {/* Zen Mode Button */}
        <button
          onClick={onToggleZenMode}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
          title={t.header.zenModeTitle}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.header.zenMode}</span>
        </button>
      </div>
    </header>
  );
};
