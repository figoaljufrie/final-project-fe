import api, { setAuthToken } from "@/lib/api";
import type {
  SocialLoginPayload,
  SocialLoginResponse,
} from "@/lib/types/users/oauth-type";

// --- Social Login (Firebase ID Token + Provider) ---
export async function socialLogin(
  idToken: string,
  provider: SocialLoginPayload["provider"] // restrict to defined union type
): Promise<SocialLoginResponse> {
  const { data } = await api.post<SocialLoginResponse>("/oauth/login", {
    idToken,
    provider,
  });

  setAuthToken(data.accessToken);
  localStorage.setItem("token", data.accessToken);

  return data; // ✅ returns correct typed response
}
