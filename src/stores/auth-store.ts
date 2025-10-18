"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as authService from "@/lib/services/Account/auth/auth-service";
import type { User } from "@/lib/types/account/user-type";

type AuthState = {
  user: User | null;
  loading: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  clearUser: () => void;
  setUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    user: null,
    loading: false,
    hydrated: false,

    login: async (email, password) => {
      set({ loading: true });
      try {
        await authService.login(email, password);

        // Wait a tiny bit for cookie to be set
        await new Promise((resolve) => setTimeout(resolve, 100));

        const user = await authService.getMe();
        set({ user, loading: false, hydrated: true });
      } catch {
        set({ user: null, loading: false, hydrated: true });
        throw new Error("Login failed");
      }
    },

    logout: async () => {
      set({ loading: true });
      try {
        await authService.logout();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Clear user state and force re-hydration
        set({ user: null, loading: false, hydrated: false });
        
        // Force redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    },

    hydrate: async () => {
      if (get().hydrated) return;

      set({ loading: true });
      try {
        const user = await authService.getMe();
        set({ user, hydrated: true, loading: false });
      } catch {
        set({ user: null, hydrated: true, loading: false });
      }
    },

    clearUser: () => {
      set({ user: null, hydrated: true });
    },

    setUser: (user: User) => {
      set({ user, hydrated: true });
    },
  }))
);
