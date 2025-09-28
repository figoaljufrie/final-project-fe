"use client";

import { useState } from "react";
import { verifyEmailAndSetPassword } from "@/lib/services/auth/auth-service";
import type { User } from "@/lib/types/users/user-type";

export function useVerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleVerify(token: string, password: string): Promise<User | null> {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const user = await verifyEmailAndSetPassword(token, password);
      setSuccess("Email verified and password successfully set!");
      return user;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Verification failed.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { handleVerify, loading, error, success };
}