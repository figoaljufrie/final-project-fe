import { User } from "./user-type";

// --- Login ---
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  user: User;
}

// --- Register ---
export interface RegisterResponse {
  message: string;
  user: User;
}

// --- Reset Password ---
export interface ResetPasswordResponse {
  message: string;
}

// --- Validate Token ---
export interface ValidateTokenResponse {
  user: User;
}