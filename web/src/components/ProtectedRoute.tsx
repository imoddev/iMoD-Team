"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, profile, loading, canAccessPage } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check for bypass auth mode
  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

  useEffect(() => {
    // Skip checks in bypass mode
    if (bypassAuth) return;
    
    if (!loading) {
      // Not logged in - redirect to login
      if (!user) {
        router.replace("/login");
        return;
      }

      // Check page access permission
      if (profile && !canAccessPage(pathname)) {
        router.replace("/dashboard?error=unauthorized");
      }
    }
  }, [user, profile, loading, pathname, router, canAccessPage, bypassAuth]);

  // Show loading while checking auth
  if (loading && !bypassAuth) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // In bypass mode, render children immediately
  if (bypassAuth) {
    return <>{children}</>;
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Render children
  return <>{children}</>;
}
