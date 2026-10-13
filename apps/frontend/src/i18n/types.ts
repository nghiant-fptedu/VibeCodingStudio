export type Language = 'vi' | 'en';

export interface Translations {
  header: {
    slogan: string;
    soundMixer: string;
    soundMixerTitle: string;
    todoList: string;
    todoListTitle: string;
    wallpaper: string;
    muteAll: string;
    unmuteAll: string;
    login: string;
    loginTitle: string;
    logout: string;
    cloudSynced: string;
    zenMode: string;
    zenModeTitle: string;
  };
  pomodoro: {
    focus: string;
    shortBreak: string;
    longBreak: string;
    start: string;
    pause: string;
    reset: string;
    skip: string;
    completedToday: string;
    sessions: string;
    customDuration: string;
    tabFocus: string;
    tabBreak: string;
  };
  zen: {
    exitZen: string;
    playing: string;
    pressEsc: string;
  };
  mixer: {
    title: string;
    subtitle: string;
    activeCount: string;
    muteAllBtn: string;
    presetsTitle: string;
    channelsTitle: string;
    doneBtn: string;
    volume: string;
    channels: {
      rain: string;
      thunder: string;
      campfire: string;
      wind: string;
      waves: string;
      stream: string;
      birds: string;
      cafe: string;
      keyboard: string;
      crickets: string;
    };
    presets: Record<string, { name: string; description: string }>;
  };
  wallpaper: {
    title: string;
    subtitle: string;
    categories: {
      all: string;
      forest: string;
      ocean: string;
      mountain: string;
      cafe: string;
      rain: string;
      night: string;
    };
    visualFilters: string;
    darkness: string;
    blur: string;
  };
  playlist: {
    title: string;
    subtitle: string;
    songsCount: string;
    cloudSynced: string;
    localGuest: string;
    addSongTitle: string;
    addSongPlaceholder: string;
    addBtn: string;
    adding: string;
    curatedSection: string;
    restoreDefaults: string;
    nowPlaying: string;
    deleteTrack: string;
  };
  todo: {
    title: string;
    cloudSynced: string;
    localGuest: string;
    todayProgress: string;
    habitsSection: string;
    habitsNote: string;
    noHabits: string;
    tasksSection: string;
    tasksNote: string;
    noTasks: string;
    addNewTitle: string;
    inputPlaceholder: string;
    typeHabit: string;
    typeTask: string;
    addBtn: string;
    deleteItem: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    tabLogin: string;
    tabRegister: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submitLogin: string;
    submitRegister: string;
    processing: string;
    orContinueWith: string;
    googleSignIn: string;
    noAccountPrompt: string;
    haveAccountPrompt: string;
    switchRegister: string;
    switchLogin: string;
  };
  player: {
    prevTrack: string;
    nextTrack: string;
    playMusic: string;
    pauseMusic: string;
    openPlaylist: string;
    quickAddTitle: string;
    quickAddHeading: string;
    volumeLabel: string;
    addBtn: string;
    addedSuccess: string;
    invalidVideoError: string;
    restrictedVideoNotice: string;
  };
  clock: {
    tooltip: string;
  };
}
