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
      console.log("Sending token to API:", token);

      const user = await verifyEmailAndSetPassword(token, password);

      console.log("API success:", user);
      setSuccess("Email verified and password successfully set!");
      return user;
    } catch (err: any) {
      console.error("Verification error:", err.response?.data || err);
      setError(err?.response?.data?.message || "Verification failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { handleVerify, loading, error, success };
}