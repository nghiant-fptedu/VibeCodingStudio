import React, { useState } from 'react';
import {
  X,
  ListMusic,
  Trash2,
  Play,
  Plus,
  Loader2,
  RotateCcw,
  ExternalLink,
  Music2,
} from 'lucide-react';
import type { YouTubeTrack } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: YouTubeTrack[];
  currentVideoId: string;
  isPlaying: boolean;
  onSelectVideo: (videoId: string) => void;
  onRemoveTrack: (id: string) => void;
  onAddTrack: (
    input: string
  ) => Promise<{ success: boolean; track?: YouTubeTrack; error?: string }>;
  onRestoreDefaults: () => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  tracks,
  currentVideoId,
  isPlaying,
  onSelectVideo,
  onRemoveTrack,
  onAddTrack,
  onRestoreDefaults,
}) => {
  const { isAuthenticated } = useAuth();
  const { language, t } = useI18n();
  const [newInput, setNewInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null
  );

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInput.trim()) return;

    setIsLoading(true);
    setMessage(null);

    const result = await onAddTrack(newInput.trim());
    setIsLoading(false);

    if (result.success) {
      setNewInput('');
      setMessage({
        type: 'success',
        text: `${language === 'vi' ? 'Đã thêm thành công:' : 'Successfully added:'} "${result.track?.title}"`,
      });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({
        type: 'error',
        text: result.error || (language === 'vi' ? 'Không thể thêm bài hát này.' : 'Failed to add this track.'),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel-modal border border-white/10 shadow-2xl p-6 md:p-8 overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-glow-amber">
              <ListMusic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">{t.playlist.title}</h2>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono text-xs">
                  {tracks.length} {t.playlist.songsCount}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isAuthenticated ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                <span className="text-[11px] text-slate-400">
                  {isAuthenticated ? t.playlist.cloudSynced : t.playlist.localGuest}
                </span>
              </div>
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

        {/* Add New Song Section */}
        <form onSubmit={handleAdd} className="my-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 shrink-0">
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            {t.playlist.addSongTitle}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t.playlist.addSongPlaceholder}
              value={newInput}
              disabled={isLoading}
              onChange={(e) => setNewInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary/60 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !newInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.playlist.adding}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{t.playlist.addBtn}</span>
                </>
              )}
            </button>
          </div>

          {message && (
            <div
              className={`mt-2.5 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${message.type === 'success'
                ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}
            >
              <span>{message.text}</span>
            </div>
          )}
        </form>

        {/* Playlist Items List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {tracks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
              <Music2 className="w-10 h-10 text-slate-600" />
              <p className="text-sm">
                {language === 'vi' ? 'Danh sách phát đang trống.' : 'Playlist is empty.'}
              </p>
              <button
                onClick={onRestoreDefaults}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.playlist.restoreDefaults}</span>
              </button>
            </div>
          ) : (
            tracks.map((track) => {
              const isCurrent = track.videoId === currentVideoId;
              return (
                <div
                  key={track.id}
                  className={`group flex items-center justify-between p-2.5 rounded-2xl border transition-all ${isCurrent
                    ? 'bg-primary/10 border-primary/40 shadow-glow-amber ring-1 ring-primary/20'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/15'
                    }`}
                >
                  {/* Left: Thumbnail & Info */}
                  <div
                    onClick={() => onSelectVideo(track.videoId)}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    {/* Video Thumbnail */}
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-white/10">
                      <img
                        src={`https://img.youtube.com/vi/${track.videoId}/mqdefault.jpg`}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isCurrent && isPlaying && (
                        <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                          <div className="flex items-end gap-0.5 h-3 w-3 text-primary">
                            <span className="w-0.5 bg-primary rounded-full animate-eq-1" />
                            <span className="w-0.5 bg-primary rounded-full animate-eq-2" />
                            <span className="w-0.5 bg-primary rounded-full animate-eq-3" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Title & Curator */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-xs font-semibold block truncate ${isCurrent ? 'text-primary' : 'text-slate-200 group-hover:text-white'
                          }`}
                        title={track.title}
                      >
                        {track.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 truncate">{track.curator}</span>
                        {track.isCustom && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-medium">
                            {language === 'vi' ? 'Tự thêm' : 'Custom'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {/* Play Button */}
                    <button
                      onClick={() => onSelectVideo(track.videoId)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCurrent
                        ? 'bg-primary text-slate-950 shadow-md'
                        : 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white'
                        }`}
                      title={t.playlist.nowPlaying}
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>

                    {/* External Link */}
                    <a
                      href={`https://www.youtube.com/watch?v=${track.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
                      title="YouTube"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Delete Button */}
                    <button
                      onClick={() => onRemoveTrack(track.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      title={t.playlist.deleteTrack}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between shrink-0 text-xs">
          <button
            onClick={onRestoreDefaults}
            className="flex items-center gap-1 text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.playlist.restoreDefaults}</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
          >
            {language === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
