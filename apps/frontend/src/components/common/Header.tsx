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
  Menu,
  X,
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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
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

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileDrawerOpen(false);
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-3 md:px-8 py-2.5 md:py-3.5 flex items-center justify-between">
        {/* Left: Brand & Quote */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-2xl glass-panel border border-white/10 shadow-lg">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-glow-amber">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 fill-slate-950" />
            </div>
            <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-primary-light bg-clip-text text-transparent">
              VibeSpace
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle text-xs text-slate-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
            <span>{t.header.slogan}</span>
          </div>
        </div>

        {/* Right: Desktop Navigation Bar (>= 768px) */}
        <div className="hidden md:flex items-center gap-2 md:gap-2.5">
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
            <span>{t.header.soundMixer}</span>
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
            <span>{t.header.todoList}</span>
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
                <span className="max-w-[120px] truncate">{user.name}</span>
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
              <span>{t.header.login}</span>
            </button>
          )}

          {/* Zen Mode Button */}
          <button
            onClick={onToggleZenMode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
            title={t.header.zenModeTitle}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{t.header.zenMode}</span>
          </button>
        </div>

        {/* Right: Mobile Minimalist Action Bar (< 768px) */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick Zen Mode Button */}
          <button
            onClick={onToggleZenMode}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-primary to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all"
            title={t.header.zenModeTitle}
            aria-label={t.header.zenMode}
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Menu Trigger */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="relative flex items-center justify-center w-8 h-8 rounded-full glass-panel border border-white/15 hover:border-white/30 text-slate-200 hover:text-white active:scale-95 transition-all shadow-md"
            title="Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4" />
            {mixerActiveCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse shadow-glow-teal" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slide-in Drawer (< 768px) */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          isMobileDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileDrawerOpen(false)}
        aria-hidden={!isMobileDrawerOpen}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] glass-panel border-l border-white/15 shadow-2xl shadow-black/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-out md:hidden ${
          isMobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Mobile Navigation"
      >
        {/* Top: Drawer Header & Close Button */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-glow-amber">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              </div>
              <span className="font-extrabold text-sm text-white">VibeSpace</span>
            </div>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center glass-panel-subtle hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile / Account Card */}
          {isAuthenticated && user ? (
            <div className="my-3.5 p-3 rounded-2xl glass-panel-subtle border border-white/10">
              <div className="flex items-center gap-2.5">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-glow-amber">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-xs truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-1 mt-0.5 text-[9px] text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t.header.cloudSynced}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  onSignOut?.();
                  logout();
                }}
                className="w-full mt-2.5 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.header.logout}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                openAuthModal('login');
              }}
              className="my-3.5 w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl glass-panel border border-primary/40 text-primary-light hover:bg-primary/10 text-xs font-semibold shadow-glow-amber transition-all"
            >
              <UserIcon className="w-4 h-4 text-primary" />
              <span>{t.header.login}</span>
            </button>
          )}

          {/* Quick Tools List */}
          <div className="space-y-1">
            {/* Sound Mixer */}
            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                onOpenMixerModal();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-xs font-medium text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-tertiary" />
                <span>{t.header.soundMixer}</span>
              </div>
              {mixerActiveCount > 0 ? (
                <span className="w-5 h-5 rounded-full bg-tertiary text-slate-950 font-bold text-[10px] flex items-center justify-center shadow-glow-teal">
                  {mixerActiveCount}
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">Off</span>
              )}
            </button>

            {/* Todo List */}
            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                onOpenTodoDrawer();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-xs font-medium text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-primary" />
                <span>{t.header.todoList}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary-light text-[10px] font-bold">
                {todoProgressPercent}%
              </span>
            </button>

            {/* Wallpaper Selector */}
            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                onOpenWallpaperModal();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-xs font-medium text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>{t.header.wallpaper}</span>
              </div>
            </button>

            {/* Master Mute Toggle */}
            <button
              onClick={onToggleMasterMute}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-xs font-medium text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>{isMuted ? t.header.unmuteAll : t.header.muteAll}</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isMuted ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {isMuted ? 'Muted' : 'Sound On'}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom: Language Switcher Pill */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Languages className="w-3.5 h-3.5 text-primary" />
            <span>{language === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
          </div>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-white/15 hover:border-white/30 text-xs font-semibold active:scale-95 transition-all"
          >
            <span className={language === 'vi' ? 'text-primary font-bold' : 'text-slate-400'}>VI</span>
            <span className="text-slate-600">/</span>
            <span className={language === 'en' ? 'text-primary font-bold' : 'text-slate-400'}>EN</span>
          </button>
        </div>
      </div>
    </>
  );
};

