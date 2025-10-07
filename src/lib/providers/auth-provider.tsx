"use client";
import { QueryProvider } from "./query-provider";
import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { setAuthToken } from "@/lib/api";
import * as authService from "@/lib/services/Account/auth/auth-service";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { hydrate, token, hydrated, user } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const init = async () => {
      if (token && !user) {
        setAuthToken(token);
        try {
          const me = await authService.getMe();
          useAuthStore.setState({ user: me });
        } catch {
          localStorage.removeItem("token");
          useAuthStore.setState({ token: null, user: null });
        }
      }
      setReady(true);
    };
    if (hydrated) init();
  }, [hydrated, token, user]);

  if (!ready || !hydrated)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading session...
      </div>
    );

  return <QueryProvider>{children}</QueryProvider>;
}
