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
  isPasswordStrongEnough,
  passwordRules,
  isValidEmail,
} from "@/lib/utils/authInput";

export default function RegisterPage() {
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedEmail = sanitiseEmail(email);

    // 1) Required
    if (!cleanedEmail) {
      showError(ValidationMessages.emailRequired, emailRef.current, setError);
      return;
    }

    // 2) Stricter format check (must include dot + 2+ chars after)
    if (!isValidEmail(cleanedEmail)) {
      showError(ValidationMessages.emailInvalid, emailRef.current, setError);
      return;
    }

    // 3) Password length
    if (!isPasswordStrongEnough(password)) {
      showError(
        ValidationMessages.passwordMinLength.replace(
          "8",
          String(passwordRules.minLength)
        ),
        passwordRef.current,
        setError
      );
      return;
    }

    // 4) Passwords match
    if (password !== confirmPassword) {
      showError(
        ValidationMessages.passwordsDoNotMatch,
        confirmRef.current,
        setError
      );
      return;
    }

    // 5) Submit to Supabase
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: cleanedEmail,
      password,
    });
    setSubmitting(false);

    if (error) {
      showError(getAuthErrorMessage(error.message), undefined, setError);
      return;
    }

    router.replace(next);
  };

  const errorId = makeErrorId("register");

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
        </div>

        <h1 className="text-3xl font-semibold mb-6">Create your account</h1>

        <form onSubmit={onSubmit} className="space-y-6" noValidate>
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
              aria-describedby={error ? errorId : undefined}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-bold mb-1">
              Password
            </label>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder={`Password (min ${passwordRules.minLength} chars)`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-2 border-[#B6D400] focus:border-green-700 focus:ring-0 rounded-lg px-4 py-3 text-green-800"
              aria-describedby={error ? errorId : undefined}
              required
              minLength={passwordRules.minLength}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block font-bold mb-1">
              Confirm Password
            </label>
            <input
              ref={confirmRef}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white border-2 border-[#B6D400] focus:border-green-700 focus:ring-0 rounded-lg px-4 py-3 text-green-800"
              aria-describedby={error ? errorId : undefined}
              required
              minLength={passwordRules.minLength}
            />
          </div>

          {error && (
            <p
              id={errorId}
              className="text-red-700"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}

          <FormButton
            type="submit"
            label={submitting ? "Creating account..." : "Create account"}
            disabled={submitting}
          />
        </form>

        <p className="mt-10 text-center">
          Already have an account?{" "}
          <Link
            href={`${ROUTES.auth.login}?next=${encodeURIComponent(next)}`}
            className="underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
