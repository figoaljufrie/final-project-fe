"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useCallback } from "react";

export function useLogout() {
  const { logout } = useAuthStore();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout]);

  return { handleLogout };
}