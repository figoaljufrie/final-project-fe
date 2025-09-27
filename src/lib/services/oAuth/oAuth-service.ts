// app/oAuth/services/oAuth-service.ts
import api, { setAuthToken } from "@/lib/api";
import type {
  SocialLoginPayload,
  SocialLoginResponse,
} from "@/lib/types/users/oauth-type";

export async function socialLogin(
  idToken: string,
  provider: SocialLoginPayload["provider"]
): Promise<SocialLoginResponse> {
  const res = await api.post("/oauth/login", { idToken, provider });

  // Axios gives res.data = { message, data } or sometimes res.data = { user, accessToken }
  // Normalize to "payload" which should be { user, accessToken }
  const payload = res.data?.data ?? res.data;

  if (!payload) {
    console.warn("oauth-service: unexpected response shape", res.data);
    throw new Error("Invalid server response for social login");
  }

  const accessToken =
    payload.accessToken ?? (payload as any).access_token ?? null;

  if (!accessToken) {
    console.warn("oauth-service: no accessToken in payload", payload);
    // still return payload so caller can handle user or errors
    return payload as SocialLoginResponse;
  }

  setAuthToken(accessToken);
  localStorage.setItem("token", accessToken);

  return payload as SocialLoginResponse;
}
