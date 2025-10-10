"use client";

import { useState } from "react";
import { registerTenant } from "@/lib/services/Account/auth/auth-service";
import type { RegisterResponse } from "@/lib/types/account/auth-type";

export function useRegisterTenant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleRegisterTenant(
    email: string
  ): Promise<RegisterResponse | null> {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await registerTenant(email);
      setSuccess(response.message);
      return response;
    } catch (error: unknown) {
      setError((error as Error).message || "Tenant Registration Failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }
  return { handleRegisterTenant, loading, error, success };
}
