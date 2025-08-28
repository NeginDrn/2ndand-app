"use client";
import { ROUTES } from "@/lib/routes";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  basicListingFieldLabels,
  listingSelectOptions,
} from "@/data/listingOptions";
import FormButton from "@/components/FormButton";
import FormField from "@/components/FormField";

import { validateForm } from "@/utils/validateForm";
import { getInitialFormState } from "@/utils/getInitialFormState";

export default function CreateListingPage() {
  const router = useRouter();

  const [form, setForm] = useState(
    getInitialFormState(basicListingFieldLabels)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleContinue = () => {
    const validationErrors = validateForm(form, basicListingFieldLabels);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstKey);
      el?.focus(); // move focus
      el?.scrollIntoView?.({ behavior: "smooth", block: "center" }); // optional
      return;
    }

    localStorage.setItem("basicListingInfo", JSON.stringify(form));
    router.push(ROUTES.createListing.additionalDetails);
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
          {Object.entries(basicListingFieldLabels).map(([field, label]) => (
            <FormField
              key={field}
              name={field}
              label={label}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              error={errors[field]}
              options={
                listingSelectOptions[field as keyof typeof listingSelectOptions]
              }
            />
          ))}

          <FormButton label="Back" onClick={() => router.back()} />
          <FormButton label="Continue" />
        </form>
      </div>
    </main>
  );
}
