import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse } from '../types';
import { login as loginApi, register as registerApi } from '../services/api';

interface UserState {
  token: string | null;
  username: string | null;
  role: string | null;
  totalXp: number;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuth: (auth: AuthResponse, token: string) => void;
  setTotalXp: (value: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      role: null,
      totalXp: 0,
      isAuthenticated: false,
      login: async (email, password) => {
        const auth = await loginApi(email, password);
        set({
          token: auth.token,
          username: auth.username,
          role: auth.role,
          totalXp: auth.totalXp,
          isAuthenticated: true,
        });
      },
      register: async (username, email, password) => {
        const auth = await registerApi(username, email, password);
        set({
          token: auth.token,
          username: auth.username,
          role: auth.role,
          totalXp: auth.totalXp,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          token: null,
          username: null,
          role: null,
          totalXp: 0,
          isAuthenticated: false,
        });
      },
      setAuth: (auth, token) => {
        set({
          token,
          username: auth.username,
          role: auth.role,
          totalXp: auth.totalXp,
          isAuthenticated: true,
        });
      },
      setTotalXp: (value) => set({ totalXp: value }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        username: state.username,
        role: state.role,
        totalXp: state.totalXp,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
