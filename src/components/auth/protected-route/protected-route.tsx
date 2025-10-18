"use client";

import { UserRole } from "@/lib/types/enums/enums-type";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Wait for auth state to hydrate
    if (!hydrated) return;

    const role = user?.role;

    // Public routes (accessible to everyone, including guests)
    const publicRoutes = [
      "/",
      "/explore",
      "/property-details",
      "/auth/login",
      "/auth/register",
      "/auth/verify-email",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // ========== 1️⃣ GUEST/NON-AUTHENTICATED ==========
    if (!user) {
      const isProfileRoute = pathname.startsWith("/profile");
      if (isPublicRoute && !isProfileRoute) {
        setIsAuthorized(true);
        return;
      }
      if (isProfileRoute) {
        router.replace("/auth/login");
      }
      // Redirect to login for protected routes
      router.replace("/auth/login");
      return;
    }

    // ========== 2️⃣ TENANT ROLE ==========
    if (role === UserRole.TENANT) {
      // Tenants can access dashboard
      const allowedTenantRoutes = ["/dashboard"];
      const isAllowed = allowedTenantRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isAllowed) {
        setIsAuthorized(true);
        return;
      }

      // Redirect tenant to dashboard if trying to access restricted routes
      router.replace("/dashboard");
      return;
    }

    // ========== 3️⃣ USER ROLE ==========
    if (role === UserRole.USER) {
      // Users CANNOT access dashboard
      if (pathname.startsWith("/dashboard")) {
        router.replace("/");
        return;
      }

      // Users can access bookings and public routes
      const allowedUserRoutes = ["/bookings", ...publicRoutes];
      const isAllowed = allowedUserRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isAllowed || isPublicRoute) {
        setIsAuthorized(true);
        return;
      }

      // Redirect to home for other routes
      router.replace("/");
      return;
    }

    // ========== 4️⃣ FALLBACK (Unknown role) ==========
    router.replace("/");
  }, [user, pathname, hydrated, router]);

  // Show loading state while checking authorization
  if (!hydrated || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
