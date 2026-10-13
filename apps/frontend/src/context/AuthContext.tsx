import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { authApi, syncApi, getAuthToken, removeAuthToken } from '../services/api';
import { getTodayFormatted } from '../utils/dateHelper';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; name: string }) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tự động gộp dữ liệu khách (Guest offline) vào tài khoản cloud khi đăng nhập lần đầu
const mergeGuestDataIfAny = async (userId: string) => {
  const syncKey = `vibespace_synced_${userId}`;
  if (localStorage.getItem(syncKey)) return;

  try {
    const localTracks = JSON.parse(localStorage.getItem('vibespace_playlists_v1') || '[]');
    const localTodoState = JSON.parse(localStorage.getItem('vibespace_todos_v1') || '{}');
    const localTodos = localTodoState.items || [];

    if (localTracks.length > 0 || localTodos.length > 0) {
      await syncApi.merge({
        tracks: localTracks,
        todos: localTodos,
        clientDate: getTodayFormatted(),
      });
    }
    localStorage.setItem(syncKey, 'true');
  } catch (err) {
    console.warn('Lỗi khi merge dữ liệu khách lên cloud:', err);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Kiểm tra token khi khởi chạy ứng dụng
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authApi.getMe();
        await mergeGuestDataIfAny(currentUser.id);
        setUser(currentUser);
        setToken(storedToken);
      } catch (err) {
        console.warn('Phiên đăng nhập đã hết hạn hoặc không hợp lệ:', err);
        removeAuthToken();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    const res = await authApi.login(credentials);
    await mergeGuestDataIfAny(res.user.id);
    setUser(res.user);
    setToken(res.token);
    setIsAuthModalOpen(false);
  }, []);

  const register = useCallback(async (data: { email: string; password: string; name: string }) => {
    const res = await authApi.register(data);
    await mergeGuestDataIfAny(res.user.id);
    setUser(res.user);
    setToken(res.token);
    setIsAuthModalOpen(false);
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const res = await authApi.loginWithGoogle(credential);
    await mergeGuestDataIfAny(res.user.id);
    setUser(res.user);
    setToken(res.token);
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    removeAuthToken();
    setUser(null);
    setToken(null);
  }, []);

  const openAuthModal = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        isAuthModalOpen,
        authModalMode,
        login,
        register,
        loginWithGoogle,
        logout,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
