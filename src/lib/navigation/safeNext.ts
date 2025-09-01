import { ROUTES } from "@/lib/routes";

/**
 * Only allow same-site paths like "/create-listing/basic-info".
 * Falls back to ROUTES.home if:
 * - empty / null
 * - absolute URL (http/https)
 * - protocol-relative (//)
 */
export function safeNextRedirect(next?: string | null, fallback = ROUTES.home) {
  if (!next) return fallback;

  // Reject absolute or external URLs
  try {
    // If this parses, it’s absolute (http:// or https:// or similar)
    new URL(next);
    return fallback;
  } catch {
    // Not an absolute URL → check shape
    if (next.startsWith("/") && !next.startsWith("//")) {
      return next;
    }
    return fallback;
  }
}
