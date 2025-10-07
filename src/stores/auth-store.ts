"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { setAuthToken } from "@/lib/api";
import * as authService from "@/lib/services/Account/auth/auth-service";
import type { User } from "@/lib/types/account/user-type";
import type { LoginResponse } from "@/lib/types/account/auth-type";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        loading: false,
        hydrated: false,

        login: async (email, password) => {
          set({ loading: true });
          const { accessToken, user } = await authService.login(
            email,
            password
          );
          localStorage.setItem("token", accessToken);
          setAuthToken(accessToken);
          set({ token: accessToken, user, loading: false });
          return { accessToken, user };
        },

        logout: () => {
          localStorage.removeItem("token");
          setAuthToken(undefined);
          set({ user: null, token: null });
        },

        hydrate: () => {
          const token = localStorage.getItem("token");
          if (token) {
            setAuthToken(token);
            set({ token, hydrated: true });
          } else {
            set({ hydrated: true });
          }
        },
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ token: state.token, user: state.user }),
      }
    )
  )
);
