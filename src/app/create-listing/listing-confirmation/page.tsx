// app/create-listing/confirmation/page.tsx
"use client";
import { ROUTES } from "@/lib/routes";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormButton from "@/components/FormButton";
import {
  basicListingFieldLabels,
  additionalListingFieldLabels,
} from "@/data/listingOptions";

type ListingDraft = Record<string, string>;

export default function ConfirmationPage() {
  const router = useRouter();
  const [listing, setListing] = useState<ListingDraft | null>(null);

  // Merge Step 1 + Step 2 labels for review UI
  const reviewFieldLabels: Record<string, string> = {
    ...basicListingFieldLabels,
    ...additionalListingFieldLabels,
  };

  const display = (v: unknown) =>
    typeof v === "string" && v.trim().length > 0 ? v : "—";

  // Load Step 1 + Step 2 from storage and merge here
  useEffect(() => {
    const basicInfoData = localStorage.getItem("basicListingInfo");
    const additionalInfoData = localStorage.getItem("additionalListingInfo");

    if (!basicInfoData || !additionalInfoData) {
      router.replace(ROUTES.createListing.basicInfo); // guard
      return;
    }

    try {
      const merged = {
        ...JSON.parse(basicInfoData),
        ...JSON.parse(additionalInfoData),
        createdAt: new Date().toISOString(),
      };
      setListing(merged);
    } catch {
      router.replace(ROUTES.createListing.basicInfo);
    }
  }, [router]);

  const handleSubmit = () => {
    if (!listing) return;

    // Save final draft
    localStorage.setItem("listingDraft", JSON.stringify(listing));
    console.log("Submitted listing:", listing);

    // Clean up temporary step data
    localStorage.removeItem("basicListingInfo");
    localStorage.removeItem("additionalListingInfo");

    // Redirect to listings page (MVP placeholder)
    router.push(ROUTES.home);
  };

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
                {display(listing[key])}
              </dd>
            </div>
          ))}
        </dl>

        {/* Actions (stacked buttons) */}
        <div className="mt-8 flex flex-col gap-4">
          <form
            className="space-y-6"
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormButton label="Back" onClick={() => router.back()} />
            <FormButton label="Submit" onClick={handleSubmit} />
          </form>
        </div>
      </div>
    </main>
  );
}
