"use client";

import * as userService from "@/lib/services/Account/user/user-service";
import type { User } from "@/lib/types/account/user-type";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authservice from "@/lib/services/Account/auth/auth-service";

// --- Fetch logged-in user ---
export function useMe() {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await userService.getMe();
      setUser(user); // keep zustand store in sync
      return user;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

// --- Fetch user by ID ---
export function useUserById(id: number) {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
}

// --- Update user info ---
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<User>) => userService.updateUser(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["me"], updatedUser);
      useAuthStore.getState().setUser(updatedUser);
    },
  });
}

// --- Update avatar ---
export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userService.updateAvatar(file),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["me"], updatedUser);
      useAuthStore.getState().setUser(updatedUser);
    },
  });
}

// --- Update password ---
export function useUpdatePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => userService.updatePassword(currentPassword, newPassword),
  });
}

// --- Update email ---
export function useUpdateEmail() {
  return useMutation({
    mutationFn: (email: string) => userService.updateEmail(email),
  });
}

// --- Verify email using token ---
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authservice.verifyEmail(token),
  });
}
