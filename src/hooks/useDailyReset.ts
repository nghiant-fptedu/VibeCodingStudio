import { useEffect, useCallback } from 'react';
import type { TodoState, TodoItem } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { getTodayFormatted } from '../utils/dateHelper';

const DEFAULT_TODO_STATE: TodoState = {
  lastActiveDate: getTodayFormatted(),
  items: [
    {
      id: 'habit-water',
      title: 'Uống 1 cốc nước ấm đầu ngày',
      type: 'habit',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'habit-plan',
      title: 'Lên 3 mục tiêu trọng tâm trong ngày',
      type: 'habit',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'habit-exercise',
      title: 'Thư giãn giãn cơ 10 phút giữa giờ',
      type: 'habit',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-pomodoro',
      title: 'Hoàn thành 4 phiên Pomodoro tập trung sâu',
      type: 'one_off',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-reading',
      title: 'Đọc 1 bài viết chuyên môn hoặc sách',
      type: 'one_off',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ],
};

export function executeDailyCheck(currentState: TodoState): TodoState {
  const today = getTodayFormatted();
  if (currentState.lastActiveDate === today) {
    return currentState;
  }

  // Bước sang ngày mới:
  // 1. Loại bỏ các task one-off đã hoàn thành từ ngày cũ
  // 2. Reset các thói quen hàng ngày (Daily habits) về trạng thái chưa làm
  const updatedItems = currentState.items
    .filter((item) => !(item.type === 'one_off' && item.completed))
    .map((item) => {
      if (item.type === 'habit') {
        return { ...item, completed: false, completedAt: undefined };
      }
      return item;
    });

  return {
    items: updatedItems,
    lastActiveDate: today,
  };
}

export function useDailyReset() {
  const [todoState, setTodoState] = useLocalStorage<TodoState>(
    'vibespace_todos_v1',
    DEFAULT_TODO_STATE
  );

  // Chạy kiểm tra ngày mới khi khởi động và khi người dùng active lại tab
  const checkDailyUpdate = useCallback(() => {
    setTodoState((prev) => executeDailyCheck(prev));
  }, [setTodoState]);

  useEffect(() => {
    checkDailyUpdate();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkDailyUpdate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkDailyUpdate]);

  const toggleItem = (id: string) => {
    setTodoState((prev) => {
      const now = new Date().toISOString();
      return {
        ...prev,
        items: prev.items.map((item) => {
          if (item.id === id) {
            const nextCompleted = !item.completed;
            return {
              ...item,
              completed: nextCompleted,
              completedAt: nextCompleted ? now : undefined,
            };
          }
          return item;
        }),
      };
    });
  };

  const addItem = (title: string, type: 'habit' | 'one_off') => {
    if (!title.trim()) return;
    const newItem: TodoItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      type,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodoState((prev) => ({
      ...prev,
      items: [newItem, ...prev.items],
    }));
  };

  const deleteItem = (id: string) => {
    setTodoState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const habits = todoState.items.filter((i) => i.type === 'habit');
  const tasks = todoState.items.filter((i) => i.type === 'one_off');

  const totalItems = todoState.items.length;
  const completedItems = todoState.items.filter((i) => i.completed).length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return {
    todoState,
    habits,
    tasks,
    progressPercent,
    completedItems,
    totalItems,
    toggleItem,
    addItem,
    deleteItem,
  };
}
