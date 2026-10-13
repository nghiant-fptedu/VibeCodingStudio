import { useState, useEffect, useCallback, useRef } from 'react';
import { BackgroundContainer } from './components/background/BackgroundContainer';
import { BackgroundSelector } from './components/background/BackgroundSelector';
import { Header } from './components/common/Header';
import { PomodoroTimer } from './components/pomodoro/PomodoroTimer';
import { ZenPomodoro } from './components/pomodoro/ZenPomodoro';
import { YouTubePlayer } from './components/music/YouTubePlayer';
import { RealtimeClock } from './components/common/RealtimeClock';
import { PlaylistModal } from './components/music/PlaylistModal';
import { SoundMixerModal } from './components/mixer/SoundMixerModal';
import { TodoDrawer } from './components/todo/TodoDrawer';
import { AuthModal } from './components/auth/AuthModal';

import { usePomodoro } from './hooks/usePomodoro';
import { useAudioMixer } from './hooks/useAudioMixer';
import { useDailyReset } from './hooks/useDailyReset';
import { usePlaylists } from './hooks/usePlaylists';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useI18n } from './context/I18nContext';
import { useAuth } from './context/AuthContext';

import type { VisualSettings } from './types';
import { DEFAULT_WALLPAPERS } from './data/defaultWallpapers';
import { CURATED_PLAYLISTS } from './data/curatedPlaylists';
import { formatTime } from './utils/timeFormatter';

export default function App() {
  // Visual & Wallpaper State
  const [visualSettings, setVisualSettings] = useLocalStorage<VisualSettings>(
    'vibespace_visual_v1',
    {
      currentWallpaperId: 'pine-forest',
      darknessOverlay: 35,
      blurAmount: 0,
      isZenMode: false,
    }
  );

  // Modals & Drawers Visibility State
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [isMixerModalOpen, setIsMixerModalOpen] = useState(false);
  const [isTodoDrawerOpen, setIsTodoDrawerOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  // YouTube Music State
  const [currentVideoId, setCurrentVideoId] = useLocalStorage<string>(
    'vibespace_music_video_id',
    CURATED_PLAYLISTS[0].videoId
  );
  const [musicVolume, setMusicVolume] = useLocalStorage<number>(
    'vibespace_music_volume',
    50
  );
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Custom Hooks
  const pomodoro = usePomodoro();
  const mixer = useAudioMixer();
  const todo = useDailyReset();
  const playlist = usePlaylists(currentVideoId, (id) => {
    setCurrentVideoId(id);
    setIsPlayingMusic(true);
  });

  const { language, t } = useI18n();

  // Cập nhật tiêu đề tab trình duyệt theo thời gian thực đếm ngược
  useEffect(() => {
    if (pomodoro.isRunning) {
      const modeLabel = pomodoro.mode === 'focus' ? t.pomodoro.tabFocus : t.pomodoro.tabBreak;
      document.title = `(${formatTime(pomodoro.timeLeft)}) ${modeLabel} — VibeSpace`;
    } else {
      document.title =
        language === 'vi'
          ? 'VibeSpace — Không gian làm việc cá nhân hóa'
          : 'VibeSpace — Personalized Aesthetic Focus Workspace';
    }
  }, [pomodoro.isRunning, pomodoro.timeLeft, pomodoro.mode, language, t]);

  // Active Wallpaper Image URL
  const activeWallpaper =
    DEFAULT_WALLPAPERS.find((w) => w.id === visualSettings.currentWallpaperId) ||
    DEFAULT_WALLPAPERS[0];

  const updateVisualSettings = (partial: Partial<VisualSettings>) => {
    setVisualSettings((prev) => ({ ...prev, ...partial }));
  };

  const toggleZenMode = () => {
    if (!visualSettings.isZenMode) {
      // Đóng các modal/drawer đang mở khi chuyển sang Zen Mode
      setIsWallpaperModalOpen(false);
      setIsMixerModalOpen(false);
      setIsTodoDrawerOpen(false);
      setIsPlaylistModalOpen(false);
    }
    updateVisualSettings({ isZenMode: !visualSettings.isZenMode });
  };

  const currentTrackTitle =
    playlist.tracks.find((p) => p.videoId === currentVideoId)?.title ||
    'Custom Lofi Stream';

  // Handler xử lý Đăng xuất: Tắt nhạc, tắt mixer, reset Pomodoro, modals và dữ liệu Guest
  const { isAuthenticated } = useAuth();

  const handleSignOutReset = useCallback(() => {
    // 1. Tắt nhạc YouTube Lofi & đưa về bài đầu tiên
    setIsPlayingMusic(false);
    if (CURATED_PLAYLISTS.length > 0) {
      setCurrentVideoId(CURATED_PLAYLISTS[0].videoId);
    }

    // 2. Tắt toàn bộ kênh âm thanh môi trường White Noise
    mixer.muteAll();

    // 3. Dừng Pomodoro & reset về Focus 25:00
    pomodoro.changeMode('focus');

    // 4. Thoát Zen Mode và khôi phục cài đặt hình nền về mặc định ban đầu
    setVisualSettings({
      currentWallpaperId: 'pine-forest',
      darknessOverlay: 35,
      blurAmount: 0,
      isZenMode: false,
    });

    // 5. Đóng toàn bộ Modals & Drawers
    setIsWallpaperModalOpen(false);
    setIsMixerModalOpen(false);
    setIsTodoDrawerOpen(false);
    setIsPlaylistModalOpen(false);

    // 6. Khôi phục dữ liệu Playlist & Todo về danh sách mẫu mặc định Guest
    playlist.resetToGuestDefaults();
    todo.resetToGuestDefaults();
  }, [mixer, pomodoro, playlist, todo, setVisualSettings, setCurrentVideoId]);

  // Double-layer trigger: Tự động reset khi isAuthenticated chuyển từ true sang false (vd: token hết hạn)
  const prevAuthRef = useRef(isAuthenticated);
  useEffect(() => {
    if (prevAuthRef.current && !isAuthenticated) {
      handleSignOutReset();
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, handleSignOutReset]);

  return (
    <BackgroundContainer
      imageUrl={activeWallpaper.imageUrl}
      darknessOverlay={visualSettings.darknessOverlay}
      blurAmount={visualSettings.blurAmount}
    >
      {/* 1. Zen Mode Minimalist View */}
      {visualSettings.isZenMode && (
        <ZenPomodoro
          timeLeft={pomodoro.timeLeft}
          mode={pomodoro.mode}
          isRunning={pomodoro.isRunning}
          onTogglePlay={() => (pomodoro.isRunning ? pomodoro.pause() : pomodoro.start())}
          onReset={pomodoro.reset}
          onSkip={pomodoro.skip}
          onExitZen={toggleZenMode}
          audioTrackTitle={currentTrackTitle}
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={() => setIsPlayingMusic((prev) => !prev)}
        />
      )}

      {/* 2. Full Standard Workspace View (luôn giữ trong DOM để duy trì iframe phát nhạc ngầm) */}
      <div
        className={`relative w-full h-full flex flex-col justify-between overflow-hidden transition-opacity duration-500 ${
          visualSettings.isZenMode ? 'opacity-0 pointer-events-none select-none' : 'opacity-100'
        }`}
        aria-hidden={visualSettings.isZenMode}
      >
        {/* Header Navigation */}
        <Header
          onOpenWallpaperModal={() => setIsWallpaperModalOpen(true)}
          onOpenMixerModal={() => setIsMixerModalOpen(true)}
          onOpenTodoDrawer={() => setIsTodoDrawerOpen(true)}
          onToggleZenMode={toggleZenMode}
          isMuted={mixer.isMasterMuted}
          onToggleMasterMute={mixer.toggleMasterMute}
          todoProgressPercent={todo.progressPercent}
          mixerActiveCount={mixer.activeCount}
          onSignOut={handleSignOutReset}
        />

        {/* Central Hero: Pomodoro Timer */}
        <main className="flex-1 flex items-center justify-center px-4 pt-16 pb-24 md:pb-28">
          <PomodoroTimer
            timeLeft={pomodoro.timeLeft}
            totalDuration={pomodoro.totalDuration}
            progressRatio={pomodoro.progressRatio}
            mode={pomodoro.mode}
            isRunning={pomodoro.isRunning}
            completedToday={pomodoro.completedToday}
            onStart={pomodoro.start}
            onPause={pomodoro.pause}
            onReset={pomodoro.reset}
            onSkip={pomodoro.skip}
            onChangeMode={pomodoro.changeMode}
          />
        </main>

        {/* Bottom Dock: YouTube Lofi Music Player */}
        <YouTubePlayer
          currentVideoId={currentVideoId}
          isPlaying={isPlayingMusic}
          volume={musicVolume}
          tracks={playlist.tracks}
          onTogglePlay={() => setIsPlayingMusic((prev) => !prev)}
          onVolumeChange={setMusicVolume}
          onSelectVideo={(id) => {
            setCurrentVideoId(id);
            setIsPlayingMusic(true);
          }}
          onOpenPlaylistModal={() => setIsPlaylistModalOpen(true)}
          onAddTrack={playlist.addTrack}
        />

        {/* Bottom-Right: Live Realtime Clock */}
        <RealtimeClock />

        {/* Overlay Modals & Drawers */}
        <BackgroundSelector
          isOpen={isWallpaperModalOpen}
          onClose={() => setIsWallpaperModalOpen(false)}
          settings={visualSettings}
          onUpdateSettings={updateVisualSettings}
        />

        <PlaylistModal
          isOpen={isPlaylistModalOpen}
          onClose={() => setIsPlaylistModalOpen(false)}
          tracks={playlist.tracks}
          currentVideoId={currentVideoId}
          isPlaying={isPlayingMusic}
          onSelectVideo={(id) => {
            setCurrentVideoId(id);
            setIsPlayingMusic(true);
          }}
          onRemoveTrack={playlist.removeTrack}
          onAddTrack={playlist.addTrack}
          onRestoreDefaults={playlist.restoreDefaults}
        />

        <SoundMixerModal
          isOpen={isMixerModalOpen}
          onClose={() => setIsMixerModalOpen(false)}
          channels={mixer.channels}
          presets={mixer.presets}
          activeCount={mixer.activeCount}
          onToggleChannel={mixer.toggleChannel}
          onUpdateVolume={mixer.updateChannelVolume}
          onApplyPreset={mixer.applyPreset}
          onMuteAll={mixer.muteAll}
        />

        <TodoDrawer
          isOpen={isTodoDrawerOpen}
          onClose={() => setIsTodoDrawerOpen(false)}
          habits={todo.habits}
          tasks={todo.tasks}
          progressPercent={todo.progressPercent}
          completedItems={todo.completedItems}
          totalItems={todo.totalItems}
          onToggleItem={todo.toggleItem}
          onAddItem={todo.addItem}
          onDeleteItem={todo.deleteItem}
        />

        {/* User Auth Modal */}
        <AuthModal />
      </div>
    </BackgroundContainer>
  );
}
