"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useAuth } from "@/hooks/useAuth";

/**
 * Guard a page so only authenticated users can view it.
 * If not logged in, redirect to Login with ?next=<path>.
 */
export function useAuthGuard(nextPath: string) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        `${ROUTES.auth.login}?next=${encodeURIComponent(nextPath)}`
      );
    }
  }, [loading, user, router, nextPath]);

  return { user, loading };
}
