import { LoginResponse } from "./auth-type";

export interface SocialLoginPayload {
  idToken: string;
  provider: "google" | "facebook" | "twitter";
}

export type SocialLoginResponse = LoginResponse;
