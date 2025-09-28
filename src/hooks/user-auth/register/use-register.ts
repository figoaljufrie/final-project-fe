"use client";

import { useState } from "react";
import { registerUser } from "@/lib/services/auth/auth-service";
import type { RegisterResponse } from "@/lib/types/users/auth-type";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleRegister(
    email: string
  ): Promise<RegisterResponse | null> {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await registerUser(email);
      setSuccess(response.message);
      return response;
    } catch (error: unknown) {
      setError((error as Error).message || "Registration Failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { handleRegister, loading, error, success };
}
