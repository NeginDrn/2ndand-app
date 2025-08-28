// app/create-listing/additional-details/page.tsx
"use client";
import { ROUTES } from "@/lib/routes";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  additionalListingFieldLabels,
  listingSelectOptions,
} from "@/data/listingOptions";
import FormField from "@/components/FormField";
import FormButton from "@/components/FormButton";
import { getInitialFormState } from "@/utils/getInitialFormState";
import { validateForm } from "@/utils/validateForm";

export default function AdditionalDetailsPage() {
  const router = useRouter();

  // Initialise with shared util for consistency with Step 1
  const [form, setForm] = useState(
    getInitialFormState(additionalListingFieldLabels)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Guard: if Step 1 data is missing, send user back to Step 1
  useEffect(() => {
    const basicInfoData = !!localStorage.getItem("basicListingInfo");
    if (!basicInfoData) {
      router.replace(ROUTES.createListing.basicInfo);
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    const validationErrors = validateForm(form, additionalListingFieldLabels);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstKey);
      el?.focus();
      el?.scrollIntoView?.({ behavior: "smooth", block: "center" }); // optional
      return;
    }

    localStorage.setItem("additionalListingInfo", JSON.stringify(form));
    router.push(ROUTES.createListing.confirmation);
  };

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

        {/* Form */}
        <form
          className="space-y-6"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleContinue();
          }}
        >
          {Object.entries(additionalListingFieldLabels).map(
            ([field, label]) => (
              <FormField
                key={field}
                name={field}
                label={label}
                value={form[field as keyof typeof form]}
                onChange={handleChange}
                error={errors[field]}
                options={
                  listingSelectOptions[
                    field as keyof typeof listingSelectOptions
                  ]
                }
              />
            )
          )}
          <FormButton label="Back" onClick={() => router.back()} />
          <FormButton label="Continue" type="submit" />
        </form>
      </div>
    </main>
  );
}
