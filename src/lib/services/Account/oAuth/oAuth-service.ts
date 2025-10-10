import api from "@/lib/api";
import type {
  SocialLoginPayload,
  SocialLoginResponse,
} from "@/lib/types/account/oauth-type";

export async function socialLogin(
  idToken: string,
  provider: SocialLoginPayload["provider"]
): Promise<SocialLoginResponse> {
  try {
    const res = await api.post(
      "/oauth/login",
      { idToken, provider },
      {
        withCredentials: true,
      }
    );

    const payload: unknown = res.data?.data ?? res.data;

    if (!payload || typeof payload !== "object") {
      console.warn("oauth-service: unexpected response shape", res.data);
      throw new Error("Invalid server response for social login");
    }

    const user = (payload as Record<string, unknown>).user;
    if (!user) {
      throw new Error("Missing user data in response");
    }

    return { user } as SocialLoginResponse;
  } catch (err: any) {
    console.error("OAuth login failed:", err);
    throw err;
  }
}
