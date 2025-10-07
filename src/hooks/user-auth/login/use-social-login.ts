"use client";

import { useState } from "react";
import { socialLogin } from "@/lib/services/Account/oAuth/oAuth-service";
import type { SocialLoginPayload, SocialLoginResponse } from "@/lib/types/account/oauth-type";
import { useAuthStore } from "@/stores/auth-store";

export function useSocialLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authStore = useAuthStore();

  const handleSocialLogin = async (
    idToken: string,
    provider: SocialLoginPayload["provider"]
  ) => {
    setLoading(true);
    setError(null);

    try {
      const payload: SocialLoginResponse = await socialLogin(idToken, provider);

      if (payload && "user" in payload) {
        authStore.setUser(payload.user);
      }

      setLoading(false);
      return payload;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Social Login Failed");
      setLoading(false);
      return null;
    }
  };

  return { handleSocialLogin, loading, error };
}