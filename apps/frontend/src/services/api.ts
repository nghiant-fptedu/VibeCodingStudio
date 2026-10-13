import type {
  ApiResponse,
  AuthResponse,
  TodoItem,
  User,
  YouTubeTrack,
  TaskType,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'vibespace_auth_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `HTTP ${response.status}: Request failed`;
    throw new ApiError(errorMsg, response.status);
  }

  return data;
}

// 1. Auth API
export const authApi = {
  async register(payload: { email: string; password: string; name: string }): Promise<AuthResponse> {
    const res = await request<ApiResponse<AuthResponse>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error('Dữ liệu trả về không hợp lệ');
    setAuthToken(res.data.token);
    return res.data;
  },

  async login(payload: { email: string; password: string }): Promise<AuthResponse> {
    const res = await request<ApiResponse<AuthResponse>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error('Dữ liệu trả về không hợp lệ');
    setAuthToken(res.data.token);
    return res.data;
  },

  async loginWithGoogle(credential: string): Promise<AuthResponse> {
    const res = await request<ApiResponse<AuthResponse>>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
    if (!res.data) throw new Error('Dữ liệu trả về không hợp lệ');
    setAuthToken(res.data.token);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await request<ApiResponse<{ user: User }>>('/api/auth/me');
    if (!res.data?.user) throw new Error('Không thể lấy thông tin người dùng');
    return res.data.user;
  },
};

// 2. Tracks API
export const tracksApi = {
  async getTracks(): Promise<YouTubeTrack[]> {
    const res = await request<ApiResponse<{ tracks: YouTubeTrack[] }>>('/api/tracks');
    return res.data?.tracks || [];
  },

  async addTrack(track: {
    title: string;
    curator?: string;
    videoId: string;
    category?: string;
  }): Promise<YouTubeTrack> {
    const res = await request<ApiResponse<{ track: YouTubeTrack }>>('/api/tracks', {
      method: 'POST',
      body: JSON.stringify(track),
    });
    if (!res.data?.track) throw new Error('Thêm bài hát thất bại');
    return res.data.track;
  },

  async deleteTrack(id: string): Promise<void> {
    await request<ApiResponse<{ message: string }>>(`/api/tracks/${id}`, {
      method: 'DELETE',
    });
  },

  async restoreDefaults(): Promise<YouTubeTrack[]> {
    const res = await request<ApiResponse<{ tracks: YouTubeTrack[] }>>('/api/tracks/restore-defaults', {
      method: 'POST',
    });
    return res.data?.tracks || [];
  },
};

// 3. Todos API
export const todosApi = {
  async getTodos(clientDate?: string): Promise<{ items: TodoItem[]; lastActiveDate: string }> {
    const query = clientDate ? `?date=${encodeURIComponent(clientDate)}` : '';
    const res = await request<ApiResponse<{ items: TodoItem[]; lastActiveDate: string }>>(`/api/todos${query}`);
    return res.data || { items: [], lastActiveDate: '' };
  },

  async createTodo(payload: { title: string; type: TaskType }): Promise<TodoItem> {
    const res = await request<ApiResponse<{ item: TodoItem }>>('/api/todos', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.data?.item) throw new Error('Tạo todo thất bại');
    return res.data.item;
  },

  async updateTodo(id: string, updates: { completed?: boolean; title?: string }): Promise<TodoItem> {
    const res = await request<ApiResponse<{ item: TodoItem }>>(`/api/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    if (!res.data?.item) throw new Error('Cập nhật todo thất bại');
    return res.data.item;
  },

  async deleteTodo(id: string): Promise<void> {
    await request<ApiResponse<{ message: string }>>(`/api/todos/${id}`, {
      method: 'DELETE',
    });
  },
};

// 4. Sync API
export const syncApi = {
  async merge(payload: {
    tracks: Array<{ title: string; curator: string; videoId: string; category?: string }>;
    todos: Array<{ title: string; type: TaskType; completed: boolean; createdAt: string; completedAt?: string }>;
    clientDate?: string;
  }): Promise<{ tracks: YouTubeTrack[]; todos: TodoItem[] }> {
    const res = await request<ApiResponse<{ tracks: YouTubeTrack[]; todos: TodoItem[] }>>('/api/sync/merge', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data || { tracks: [], todos: [] };
  },
};
