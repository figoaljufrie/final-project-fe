// hooks/user-auth/login/use-social-login.ts
"use client";

import { useState } from "react";
import { socialLogin } from "@/lib/services/oAuth/oAuth-service";
import type { SocialLoginPayload } from "@/lib/types/users/oauth-type";
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
      const payload = await socialLogin(idToken, provider);

      if (payload && (payload as any).user) {
        authStore.setUser((payload as any).user);
      }
      setLoading(false);
      return payload;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Social Login Failed"
      );
      setLoading(false);
      return null;
    }
  };

  return { handleSocialLogin, loading, error };
}
