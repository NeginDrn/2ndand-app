"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  listingAdditionalFieldLabels,
  listingConditionOptions,
} from "@/data/listingOptions";
import FormButton from "@/components/FormButton";

type FormKeys = keyof typeof listingAdditionalFieldLabels;

export default function AdditionalDetailsPage() {
  const router = useRouter();

  const [form, setForm] = useState<Record<FormKeys, string>>({
    condition: "",
    price: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("basicListingInfo");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Retrieved basic info from storage:", parsedData);
        // Optional: Merge with form state if needed
      } catch (error) {
        console.error("Failed to parse listing info from storage:", error);
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Submitted:", form);
    // router.push("/create-listing/confirmation"); // Enable when ready
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
        <form className="space-y-6">
          {Object.entries(listingAdditionalFieldLabels).map(
            ([field, label]) => {
              const isSelect = field === "condition";
              return (
                <div key={field}>
                  <label htmlFor={field} className="block font-bold mb-1">
                    {label}
                  </label>

                  {isSelect ? (
                    <select
                      name={field}
                      value={form[field as FormKeys]}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-[#B6D400] rounded-lg px-4 py-3 text-green-800 appearance-none"
                    >
                      <option value="">Select condition</option>
                      {listingConditionOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={form[field as FormKeys]}
                      onChange={handleChange}
                      placeholder={label}
                      className="w-full bg-white border-2 border-[#B6D400] rounded-lg px-4 py-3 text-green-800"
                    />
                  )}
                </div>
              );
            }
          )}
          <FormButton label="Back" onClick={() => router.back()} />
          <FormButton label="Submit" onClick={handleSubmit} />
        </form>
      </div>
    </main>
  );
}
