// hooks/user-auth/login/use-login.ts
"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useState } from "react";
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authStore = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authStore.login(email, password);
      setLoading(false);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Login failed");
      setLoading(false);
      return null;
    }
  };

  return { handleLogin, loading, error };
}