// app/page.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { ROUTES } from "@/lib/routes";
import ButtonLink from "@/components/ButtonLinks";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <main className="min-h-screen bg-[#FFFEF2] text-green-800 flex flex-col items-center px-6 py-10">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-24">
        <div className="flex items-center space-x-2">
          {/* Replace with logo image or SVG */}
          <div className="text-3xl font-bold">&</div>
          <span className="text-2xl font-semibold tracking-tight">2ndand</span>
        </div>

        <div className="flex space-x-6">
          {!loading && !user && (
            <>
              <Link href={ROUTES.auth.login} className="text-lg font-medium">
                Login
              </Link>
              <Link href={ROUTES.auth.register} className="text-lg font-medium">
                Register
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              <Link
                href={ROUTES.account.myListings}
                className="text-lg font-medium"
              >
                My Listings
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = ROUTES.home;
                }}
                className="text-lg font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="text-center flex flex-col items-center">
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight mb-16 text-center">
          Buy and sell
          <span className="inline sm:hidden"> </span>
          <span className="hidden sm:inline">
            <br />
          </span>
          appliance parts
        </h1>

        <div className="flex flex-col sm:flex-row gap-6">
          <ButtonLink href={ROUTES.search}>Search for a part</ButtonLink>
          <ButtonLink href={ROUTES.createListing.basicInfo}>
            List a part for sale
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
