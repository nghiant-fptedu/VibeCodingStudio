import { useState, useEffect, useCallback, useRef } from 'react';
import type { TodoState, TodoItem, TaskType } from '../types';
import { getTodayFormatted } from '../utils/dateHelper';
import { useAuth } from '../context/AuthContext';
import { todosApi } from '../services/api';

const LOCAL_STORAGE_KEY = 'vibespace_todos_v1';

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

  // Bước sang ngày mới (Offline Guest mode):
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

const getStoredTodoState = (): TodoState => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed: TodoState = JSON.parse(raw);
      return executeDailyCheck(parsed);
    }
    return DEFAULT_TODO_STATE;
  } catch {
    return DEFAULT_TODO_STATE;
  }
};

const saveStoredTodoState = (state: TodoState): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Lưu todo vào localStorage thất bại:', err);
  }
};

export function useDailyReset() {
  const { isAuthenticated, user } = useAuth();
  const [todoState, setTodoState] = useState<TodoState>(getStoredTodoState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFetchingRef = useRef(false);

  // 1. Tải danh sách Todo từ Cloud khi đăng nhập hoặc chuyển đổi người dùng
  const fetchCloudTodos = useCallback(async () => {
    if (!isAuthenticated || isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const cloudData = await todosApi.getTodos(getTodayFormatted());
      setTodoState({
        items: cloudData.items,
        lastActiveDate: cloudData.lastActiveDate || getTodayFormatted(),
      });
    } catch (err) {
      console.warn('Lấy todo từ cloud thất bại, giữ state hiện tại:', err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Khi là Guest hoặc Đăng xuất: nạp lại từ localStorage và chạy daily check
      setTodoState(getStoredTodoState());
      return;
    }

    fetchCloudTodos();
  }, [isAuthenticated, user?.id, fetchCloudTodos]);

  // 2. Tự động kiểm tra / làm mới khi tab trình duyệt active trở lại
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (isAuthenticated) {
          fetchCloudTodos();
        } else {
          setTodoState((prev) => {
            const checked = executeDailyCheck(prev);
            saveStoredTodoState(checked);
            return checked;
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, fetchCloudTodos]);

  // 3. Đánh dấu hoàn thành / chưa hoàn thành
  const toggleItem = useCallback(
    async (id: string) => {
      let targetCompleted = false;

      // Optimistic UI update
      setTodoState((prev) => {
        const now = new Date().toISOString();
        const updatedItems = prev.items.map((item) => {
          if (item.id === id) {
            targetCompleted = !item.completed;
            return {
              ...item,
              completed: targetCompleted,
              completedAt: targetCompleted ? now : undefined,
            };
          }
          return item;
        });

        const newState = { ...prev, items: updatedItems };
        if (!isAuthenticated) {
          saveStoredTodoState(newState);
        }
        return newState;
      });

      if (isAuthenticated) {
        try {
          await todosApi.updateTodo(id, { completed: targetCompleted });
        } catch (err) {
          console.error('Lỗi khi cập nhật trạng thái todo trên cloud:', err);
          // Rollback nếu API lỗi
          fetchCloudTodos();
        }
      }
    },
    [isAuthenticated, fetchCloudTodos]
  );

  // 4. Thêm công việc hoặc thói quen mới
  const addItem = useCallback(
    async (title: string, type: TaskType) => {
      if (!title.trim()) return;

      const tempId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newItem: TodoItem = {
        id: tempId,
        title: title.trim(),
        type,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      // Optimistic UI update
      setTodoState((prev) => {
        const newState = {
          ...prev,
          items: [newItem, ...prev.items],
        };
        if (!isAuthenticated) {
          saveStoredTodoState(newState);
        }
        return newState;
      });

      if (isAuthenticated) {
        try {
          const savedItem = await todosApi.createTodo({
            title: title.trim(),
            type,
          });
          // Cập nhật lại ID thật từ server
          setTodoState((prev) => ({
            ...prev,
            items: prev.items.map((item) => (item.id === tempId ? savedItem : item)),
          }));
        } catch (err) {
          console.error('Lỗi khi thêm todo lên cloud:', err);
          fetchCloudTodos();
        }
      }
    },
    [isAuthenticated, fetchCloudTodos]
  );

  // 5. Xóa công việc
  const deleteItem = useCallback(
    async (id: string) => {
      // Optimistic UI update
      setTodoState((prev) => {
        const newState = {
          ...prev,
          items: prev.items.filter((item) => item.id !== id),
        };
        if (!isAuthenticated) {
          saveStoredTodoState(newState);
        }
        return newState;
      });

      if (isAuthenticated) {
        try {
          await todosApi.deleteTodo(id);
        } catch (err) {
          console.error('Lỗi khi xóa todo trên cloud:', err);
          fetchCloudTodos();
        }
      }
    },
    [isAuthenticated, fetchCloudTodos]
  );

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
    isLoading,
    toggleItem,
    addItem,
    deleteItem,
  };
}
