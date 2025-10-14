// app/types/users/user.ts
import { UserRole } from "../enums/enums-type";

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  dateOfBirth?: Date | null;
  phoneNumber?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  createdAt: string;
  updatedAt: string;
}
