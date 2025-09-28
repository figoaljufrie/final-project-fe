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

  const payload: unknown = res.data?.data ?? res.data;

  if (!payload || typeof payload !== "object") {
    console.warn("oauth-service: unexpected response shape", res.data);
    throw new Error("Invalid server response for social login");
  }

  const p = payload as Record<string, unknown>;
  const accessToken =
    typeof p.accessToken === "string"
      ? p.accessToken
      : typeof p.access_token === "string"
      ? p.access_token
      : null;

  if (accessToken) {
    setAuthToken(accessToken);
    localStorage.setItem("token", accessToken);
  }

  return payload as SocialLoginResponse;
}
