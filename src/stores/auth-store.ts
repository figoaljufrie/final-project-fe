"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { setAuthToken } from "@/lib/api";
import * as authService from "@/lib/services/auth/auth-service";
import type { User } from "@/lib/types/users/user-type";
import type { LoginResponse } from "@/lib/types/users/auth-type";

type AuthState = {
  user: User | null;
  loading: boolean;
  token: string | null;
  hydrated: boolean;

  hydrateFromStorage: () => Promise<void>;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    loading: false,
    token: null,
    hydrated: false,

    hydrateFromStorage: async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (token) {
          setAuthToken(token);
          set({ token, loading: true });

          const me = await authService.getMe();
          set({ user: me, loading: false, hydrated: true });
        } else {
          set({ user: null, token: null, loading: false, hydrated: true });
        }
      } catch (e) {
        console.error("Failed to hydrate auth:", e);
        localStorage.removeItem("token");
        setAuthToken(undefined);
        set({ user: null, token: null, loading: false, hydrated: true });
      }
    },

    login: async (email: string, password: string) => {
      set({ loading: true });
      try {
        const { accessToken, user } = await authService.login(email, password);
        localStorage.setItem("token", accessToken);
        setAuthToken(accessToken);
        set({ token: accessToken, user, loading: false });
        return { accessToken, user };
      } catch (err) {
        set({ loading: false });
        throw err;
      }
    },

    logout: () => {
      localStorage.removeItem("token");
      setAuthToken(undefined);
      set({ user: null, token: null });
    },

    setUser: (user: User | null) => set({ user }),
  }))
);
