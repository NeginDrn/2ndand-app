"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * If user is logged in, redirect them away from pages like /login or /register.
 * Example: useRedirectIfAuthenticated(nextPath)
 */
export function useRedirectIfAuthenticated(targetPath: string) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace(targetPath);
    }
  }, [loading, user, targetPath, router]);
}
