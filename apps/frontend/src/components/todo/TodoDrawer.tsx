import React, { useState } from 'react';
import { X, CheckSquare, Plus, Trash2, Repeat, CalendarCheck } from 'lucide-react';
import type { TodoItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';

interface TodoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  habits: TodoItem[];
  tasks: TodoItem[];
  progressPercent: number;
  completedItems: number;
  totalItems: number;
  onToggleItem: (id: string) => void;
  onAddItem: (title: string, type: 'habit' | 'one_off') => void;
  onDeleteItem: (id: string) => void;
}

export const TodoDrawer: React.FC<TodoDrawerProps> = ({
  isOpen,
  onClose,
  habits,
  tasks,
  progressPercent,
  completedItems,
  totalItems,
  onToggleItem,
  onAddItem,
  onDeleteItem,
}) => {
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'habit' | 'one_off'>('one_off');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddItem(newTitle.trim(), newType);
    setNewTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full glass-panel-modal border-l border-white/10 shadow-2xl p-6 flex flex-col text-slate-100 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-glow-amber">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">{t.todo.title}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isAuthenticated ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                <span className="text-[11px] text-slate-400">
                  {isAuthenticated ? t.todo.cloudSynced : t.todo.localGuest}
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

        {/* Progress Bar Card */}
        <div className="my-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">{t.todo.todayProgress}</span>
            <span className="text-xs font-mono font-bold text-primary">
              {completedItems}/{totalItems} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-tertiary via-amber-500 to-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Scrollable Todo Lists */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {/* 1. Daily Habits */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-tertiary" /> {t.todo.habitsSection}
              </span>
              <span className="text-[10px] text-slate-500">{t.todo.habitsNote}</span>
            </div>

            <div className="space-y-2">
              {habits.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500 rounded-xl bg-white/[0.02]">
                  {t.todo.noHabits}
                </div>
              ) : (
                habits.map((item: TodoItem) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      item.completed
                        ? 'bg-white/[0.02] border-white/5 opacity-60'
                        : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => onToggleItem(item.id)}
                      className="flex items-center gap-3 text-left flex-1 min-w-0"
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                          item.completed
                            ? 'bg-tertiary text-slate-950 font-bold text-xs'
                            : 'border border-white/30 hover:border-tertiary'
                        }`}
                      >
                        {item.completed && '✓'}
                      </div>
                      <span
                        className={`text-xs ${
                          item.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title={t.playlist.deleteTrack}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Daily Tasks */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-primary" /> {t.todo.tasksSection}
              </span>
              <span className="text-[10px] text-slate-500">{t.todo.tasksNote}</span>
            </div>

            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500 rounded-xl bg-white/[0.02]">
                  {t.todo.noTasks}
                </div>
              ) : (
                tasks.map((item: TodoItem) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      item.completed
                        ? 'bg-white/[0.02] border-white/5 opacity-60'
                        : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => onToggleItem(item.id)}
                      className="flex items-center gap-3 text-left flex-1 min-w-0"
                    >
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                          item.completed
                            ? 'bg-primary text-slate-950 font-bold text-xs'
                            : 'border border-white/30 hover:border-primary'
                        }`}
                      >
                        {item.completed && '✓'}
                      </div>
                      <span
                        className={`text-xs ${
                          item.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title={t.playlist.deleteTrack}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add New Item Form */}
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => setNewType('one_off')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all ${
                newType === 'one_off'
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'bg-white/5 border-white/5 text-slate-400'
              }`}
            >
              {t.todo.typeTask}
            </button>
            <button
              type="button"
              onClick={() => setNewType('habit')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all ${
                newType === 'habit'
                  ? 'bg-tertiary/20 border-tertiary/50 text-tertiary'
                  : 'bg-white/5 border-white/5 text-slate-400'
              }`}
            >
              {t.todo.typeHabit}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t.todo.inputPlaceholder}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary/60"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-xl bg-primary text-slate-950 flex items-center justify-center font-bold hover:brightness-110 active:scale-95 transition-all shrink-0"
              aria-label={t.todo.addBtn}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
