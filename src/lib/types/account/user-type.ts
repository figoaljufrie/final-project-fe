// app/types/users/user.ts
export type UserRole = "user" | "tenant";

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Payloads
export interface UpdateUserPayload {
  name?: string;
  username?: string;
  bio?: string;
}
