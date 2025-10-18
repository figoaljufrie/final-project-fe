"use client";

import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@/lib/types/enums/enums-type";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;

    // If user is logged in and trying to access auth pages, redirect to appropriate page
    if (user) {
      if (pathname.startsWith("/auth/")) {
        console.log("🔄 User already logged in, redirecting from auth page");
        
        if (user.role === UserRole.TENANT) {
          router.replace("/dashboard");
        } else {
          router.replace("/");
        }
      }
    }
  }, [user, pathname, hydrated, router]);

  return null; // This component doesn't render anything
}
