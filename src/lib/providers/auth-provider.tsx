"use client";
import { QueryProvider } from "./query-provider";
import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { ProtectedRoute } from "@/components/auth/protected-route/protected-route";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { hydrate, hydrated } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await hydrate();
      setReady(true);
    };
    init();
  }, [hydrate]);

  if (!ready || !hydrated)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading session...
      </div>
    );

  return (
    <QueryProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </QueryProvider>
  );
}
