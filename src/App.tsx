import { useState, useEffect } from 'react';
import { BackgroundContainer } from './components/background/BackgroundContainer';
import { BackgroundSelector } from './components/background/BackgroundSelector';
import { Header } from './components/common/Header';
import { PomodoroTimer } from './components/pomodoro/PomodoroTimer';
import { ZenPomodoro } from './components/pomodoro/ZenPomodoro';
import { YouTubePlayer } from './components/music/YouTubePlayer';
import { SoundMixerModal } from './components/mixer/SoundMixerModal';
import { TodoDrawer } from './components/todo/TodoDrawer';

import { usePomodoro } from './hooks/usePomodoro';
import { useAudioMixer } from './hooks/useAudioMixer';
import { useDailyReset } from './hooks/useDailyReset';
import { useLocalStorage } from './hooks/useLocalStorage';

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

  // Cập nhật tiêu đề tab trình duyệt theo thời gian thực đếm ngược
  useEffect(() => {
    if (pomodoro.isRunning) {
      const modeLabel = pomodoro.mode === 'focus' ? '🍅 Tập trung' : '☕ Nghỉ ngơi';
      document.title = `(${formatTime(pomodoro.timeLeft)}) ${modeLabel} — VibeSpace`;
    } else {
      document.title = 'VibeSpace — Personalized Aesthetic Focus Workspace';
    }
  }, [pomodoro.isRunning, pomodoro.timeLeft, pomodoro.mode]);

  // Active Wallpaper Image URL
  const activeWallpaper =
    DEFAULT_WALLPAPERS.find((w) => w.id === visualSettings.currentWallpaperId) ||
    DEFAULT_WALLPAPERS[0];

  const updateVisualSettings = (partial: Partial<VisualSettings>) => {
    setVisualSettings((prev) => ({ ...prev, ...partial }));
  };

  const toggleZenMode = () => {
    updateVisualSettings({ isZenMode: !visualSettings.isZenMode });
  };

  const currentTrackTitle =
    CURATED_PLAYLISTS.find((p) => p.videoId === currentVideoId)?.title ||
    'Custom Lofi Stream';

  return (
    <BackgroundContainer
      imageUrl={activeWallpaper.imageUrl}
      darknessOverlay={visualSettings.darknessOverlay}
      blurAmount={visualSettings.blurAmount}
    >
      {/* 1. Zen Mode Minimalist View */}
      {visualSettings.isZenMode ? (
        <ZenPomodoro
          timeLeft={pomodoro.timeLeft}
          isRunning={pomodoro.isRunning}
          onTogglePlay={() => (pomodoro.isRunning ? pomodoro.pause() : pomodoro.start())}
          onReset={pomodoro.reset}
          onExitZen={toggleZenMode}
          audioTrackTitle={currentTrackTitle}
        />
      ) : (
        /* 2. Full Standard Workspace View */
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
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
            onTogglePlay={() => setIsPlayingMusic((prev) => !prev)}
            onVolumeChange={setMusicVolume}
            onSelectVideo={(id) => {
              setCurrentVideoId(id);
              setIsPlayingMusic(true);
            }}
          />

          {/* Overlay Modals & Drawers */}
          <BackgroundSelector
            isOpen={isWallpaperModalOpen}
            onClose={() => setIsWallpaperModalOpen(false)}
            settings={visualSettings}
            onUpdateSettings={updateVisualSettings}
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
        </div>
      )}
    </BackgroundContainer>
  );
}
