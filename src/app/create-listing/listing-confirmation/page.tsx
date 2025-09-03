"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ROUTES } from "@/lib/routes";
import FormButton from "@/components/FormButton";
import {
  basicListingFieldLabels,
  additionalListingFieldLabels,
} from "@/data/listingOptions";
import { useAuthGuard } from "@/hooks/useAuthGuard";

type ListingDraft = {
  brand: string;
  applianceType: string;
  partType: string;
  shortDescription: string;
  condition: string;
  price: string;
  location: string;
  description: string;
};

export default function ConfirmationPage() {
  const router = useRouter();
  // 🔐 Require login before showing confirmation
  const { loading } = useAuthGuard(ROUTES.createListing.confirmation);

  const [listing, setListing] = useState<ListingDraft | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Labels to display (Step 1 first, then Step 2)
  const reviewFieldLabels: Record<string, string> = {
    ...basicListingFieldLabels,
    ...additionalListingFieldLabels,
  };

  const display = (v: unknown) =>
    typeof v === "string" && v.trim().length > 0 ? v : "—";

  // Load Step 1 + Step 2 from storage, merge here
  useEffect(() => {
    if (!loading) {
      const basicRaw = localStorage.getItem("basicListingInfo");
      const additionalRaw = localStorage.getItem("additionalListingInfo");
      if (!basicRaw || !additionalRaw) {
        router.replace(ROUTES.createListing.basicInfo);
        return;
      }
      try {
        const merged: ListingDraft = {
          ...(JSON.parse(basicRaw) as Record<string, string>),
          ...(JSON.parse(additionalRaw) as Record<string, string>),
        } as ListingDraft;
        setListing(merged);
      } catch {
        router.replace(ROUTES.createListing.basicInfo);
      }
    }
  }, [loading, router]);

  const toNumber = (v: string) =>
    Number(v.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;

  const toDbPayload = (draft: ListingDraft) => ({
    brand: draft.brand,
    appliance_type: draft.applianceType,
    part_type: draft.partType,
    short_description: draft.shortDescription,
    condition: draft.condition,
    price: toNumber(draft.price),
    location: draft.location,
    description: draft.description,
    // created_at: let DB default handle it
    // user_id: null for now (until auth)
  });

  const handleSubmit = async () => {
    if (!listing || submitting) return;

    // 1) get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 2) if not logged in, send to login (carry return path)
    if (!user) {
      router.push(
        `${ROUTES.auth.login}?next=${encodeURIComponent(
          ROUTES.createListing.confirmation
        )}`
      );
      return;
    }

    setSubmitting(true);

    // 3) include user_id in payload
    const payload = {
      ...toDbPayload(listing),
      user_id: user.id,
    };

    const { error } = await supabase.from("listings").insert([payload]);
    setSubmitting(false);

    if (error) {
      console.error("Failed to insert listing:", error);
      alert(`Sorry, we couldn’t save your listing. ${error.message ?? ""}`);
      return;
    }

    localStorage.removeItem("basicListingInfo");
    localStorage.removeItem("additionalListingInfo");
    router.push(ROUTES.home);
  };

  // While checking auth, render nothing
  if (loading) return null;
  if (!listing) return null;

  return (
    <main className="min-h-screen bg-[#FFFEF2] text-green-800 px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-md mb-10">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="text-4xl font-bold leading-none text-green-700">
            &
          </div>
          <h1 className="text-3xl font-semibold">Create a Listing</h1>
        </div>

        <h2 className="text-xl font-bold mb-6">Review your details</h2>

        {/* Read-only summary */}
        <dl className="border-2 border-[#B6D400] rounded-xl overflow-hidden">
          {Object.entries(reviewFieldLabels).map(([key, label], idx, arr) => (
            <div
              key={key}
              className={[
                "grid grid-cols-2 gap-4 px-4 py-3 items-start",
                idx < arr.length - 1 ? "border-b border-[#B6D400]" : "",
              ].join(" ")}
            >
              <dt className="font-bold">{label}</dt>
              <dd className="text-green-800 whitespace-pre-wrap">
                {display(listing[key as keyof ListingDraft])}
              </dd>
            </div>
          ))}
        </dl>

        {/* Actions: Back (button) + Submit (form submit) */}
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <FormButton
            label="Back"
            type="button"
            onClick={() => router.back()}
          />
          <FormButton
            label={submitting ? "Submitting..." : "Submit"}
            type="submit"
          />
        </form>
      </div>
    </main>
  );
}
