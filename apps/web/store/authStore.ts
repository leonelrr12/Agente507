import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,

  setToken: (token) => {
    localStorage.setItem('access_token', token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ token: null });
  },

  hydrate: () => {
    const token = localStorage.getItem('access_token');
    if (token) set({ token });
  },
}));
