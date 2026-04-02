// src/stores/auth.store.ts
import { create } from 'zustand';

export interface User {
  id: number;
  username: string;
  full_name: string; 
  role: string; // Lưu tên Role (Admin, HR...) để Frontend dễ ẩn/hiện Menu
  department: number | null; 
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,

  login: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  isAuthenticated: () => !!get().token,
}));