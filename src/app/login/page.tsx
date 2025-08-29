// app/login/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ROUTES } from "@/lib/routes";
import FormButton from "@/components/FormButton";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || ROUTES.home;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setSubmitting(false);

    if (error) {
      setError(error.message || "Failed to sign in. Please try again.");
      return;
    }

    router.replace(next); // go back where they intended to go
  };

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
          <div>
            <label htmlFor="email" className="block font-bold mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-white border-2 border-[#B6D400] focus:border-green-700 focus:ring-0 rounded-lg px-4 py-3 text-green-800`}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-bold mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white border-2 border-[#B6D400] focus:border-green-700 focus:ring-0 rounded-lg px-4 py-3 text-green-800`}
              required
              minLength={6}
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
          </div>

          {error && (
            <p className="text-red-700" role="alert" aria-live="polite">
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
