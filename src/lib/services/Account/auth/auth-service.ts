import api, { setAuthToken } from "@/lib/api";
import type {
  LoginResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from "@/lib/types/account/auth-type";
import type { User } from "@/lib/types/account/user-type";

// --- Register ---
export async function registerUser(email: string): Promise<RegisterResponse> {
  const { data } = await api.post("/auth/register", { email });
  return data.data;
}

export async function registerTenant(email: string): Promise<RegisterResponse> {
  const { data } = await api.post("/auth/register-tenant", { email });
  return data.data;
}

// --- Login ---
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", { email, password });
  setAuthToken(data.data.accessToken);
  localStorage.setItem("token", data.data.accessToken);
  return data.data;
}

// Get current logged-in user
export async function getMe(): Promise<User> {
  const { data } = await api.get("/users/me");
  return data.data; // unwrap safe user
}

// --- Email Verification ---
export async function verifyEmail(token: string): Promise<User> {
  const { data } = await api.post(
    "/auth/verify-email",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.data.user;
}

export async function verifyEmailAndSetPassword(
  token: string,
  password: string
): Promise<User> {
  const { data } = await api.post(
    "/auth/verify-email-set-password",
    { password },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.data.user;
}

export async function resendVerification(email: string) {
  const { data } = await api.post("/auth/resend-verification", { email });
  return data.data;
}

// --- Password Reset ---
export async function forgotPassword(email: string) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data.data;
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> {
  const { data } = await api.post(
    "/auth/reset-password",
    { newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.data;
}

// --- Session Validation ---
export async function validateToken(token: string): Promise<User> {
  const { data } = await api.post("/auth/validate-token", { token });
  return data.data;
}

// --- Logout ---
export function logout() {
  setAuthToken(undefined);
  localStorage.removeItem("token");
}
