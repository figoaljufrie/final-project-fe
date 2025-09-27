import api from "@/lib/api";
import type { User, UpdateUserPayload } from "@/lib/types/users/user-type";

// --- Get Users ---
export async function getAllUsers(): Promise<User[]> {
  const { data } = await api.get("/users");
  return data.data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get("/users/me");
  return data.data;
}

export async function getUserById(id: number): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return data.data;
}

// --- Update ---
export async function updateEmail(email: string): Promise<User> {
  const { data } = await api.patch("/users/update-email", { email });
  return data.data;
}

export async function updateUser(payload: UpdateUserPayload): Promise<User> {
  const { data } = await api.patch("/users/update-user", payload);
  return data.data;
}

export async function updateAvatar(file: File): Promise<User> {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.patch("/users/update-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<User> {
  const { data } = await api.patch("/users/update-password", {
    currentPassword,
    newPassword,
  });
  return data.data;
}

// --- Delete ---
export async function softDeleteUser(): Promise<User> {
  const { data } = await api.patch("/users/soft-delete");
  return data.data;
}

export async function hardDeleteUser(): Promise<User> {
  const { data } = await api.delete("/users");
  return data.data;
}
