// app/login/page.tsx
"use client";

import { useState, useRef, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ROUTES } from "@/lib/routes";
import FormButton from "@/components/FormButton";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import { safeNextRedirect } from "@/lib/navigation/safeNext";
import { showError, makeErrorId } from "@/lib/ui/forms";
import {
  getAuthErrorMessage,
  ValidationMessages,
} from "@/lib/errors/authErrors";
import {
  sanitiseEmail,
  isValidEmail,
  passwordRules,
} from "@/lib/utils/authInput";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Safe `next` handling
  const rawNext = searchParams.get("next");
  const next = safeNextRedirect(rawNext, ROUTES.home);
  // If already logged in, bounce to `next`
  useRedirectIfAuthenticated(next);

  // Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Global/server error (e.g., Supabase)
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // Field-level errors (show multiple at once)
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Refs for focus management
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side validation
    const sanitisedEmail = sanitiseEmail(email);
    const errs: typeof fieldErrors = {};

    if (!sanitisedEmail) {
      errs.email = ValidationMessages.emailRequired;
    } else if (!isValidEmail(sanitisedEmail)) {
      errs.email = ValidationMessages.emailInvalid;
    }

    if (!password) {
      errs.password = ValidationMessages.passwordRequired;
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      if (errs.email) emailRef.current?.focus();
      else if (errs.password) passwordRef.current?.focus();
      return;
    }

    // Submit to Supabase
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: sanitisedEmail,
      password,
    });
    setSubmitting(false);

    if (error) {
      // Now maps invalid creds → "Incorrect email or password. Please try again."
      showError(getAuthErrorMessage(error.message), undefined, (msg) => {
        setError(msg);
        // focus after React paints
        setTimeout(() => errorRef.current?.focus(), 0);
      });
      return;
    }

    router.replace(next); // go back where they intended to go
  };

  // Global error id for a11y (polite live region)
  const errorId = makeErrorId("login");

  return (
    <main className="min-h-screen bg-[#FFFEF2] text-green-800 px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-md">
        {/* Header / Logo */}
        <div className="flex items-center space-x-3 mb-10">
          <div
            aria-hidden
            className="text-4xl font-bold leading-none text-green-700"
          >
            &
          </div>
          <h1 className="text-3xl font-semibold">Login</h1>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-bold mb-1">
              Email
            </label>
            <input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-[#B6D400] focus:border-green-700 focus:ring-0 rounded-lg px-4 py-3 text-green-800"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              required
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-red-700 mt-1" role="alert">
                {fieldErrors.email}
              </p>
            )}
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-bold mb-1">
              Password
            </label>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-2 border-[#B6D400] focus:border-green-700 focus:ring-0 rounded-lg px-4 py-3 text-green-800"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              required
              minLength={passwordRules.minLength}
            />
            <div className="mt-2 text-right">
              <Link
                className="underline"
                href={`${ROUTES.auth.resetPassword}?email=${encodeURIComponent(
                  email || ""
                )}`}
              >
                Forgot password?
              </Link>
            </div>
            {fieldErrors.password && (
              <p id="password-error" className="text-red-700 mt-1" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>
          {/* Global/server error (polite live region) */}
          {error && (
            <p
              id={errorId}
              ref={errorRef}
              className="text-red-700"
              role="alert"
              tabIndex={-1}
            >
              {error}
            </p>
          )}
          <FormButton
            type="submit"
            label={submitting ? "Signing in..." : "Sign In"}
            disabled={submitting}
          />
        </form>

        <p className="mt-10 text-center">
          Don’t have an account?{" "}
          <Link
            href={`${ROUTES.auth.register}?next=${encodeURIComponent(next)}`}
            className="underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
