"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  listingFieldLabels,
  listingSelectOptions,
} from "@/data/listingOptions";
import FormButton from "@/components/FormButton";

export default function CreateListingPage() {
  const [form, setForm] = useState({
    brand: "",
    appliance_type: "",
    part_type: "",
    short_description: "",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    localStorage.setItem("basicListingInfo", JSON.stringify(form));
    router.push("/create-listing/additional-details");
  };

  return (
    <main className="min-h-screen bg-[#FFFEF2] text-green-800 px-6 py-10 flex flex-col items-center">
      {/* Logo and Heading */}
      <div className="w-full max-w-md mb-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="text-4xl font-bold leading-none text-green-700">
            &
          </div>
          <h1 className="text-3xl font-semibold">Create a Listing</h1>
        </div>

        {/* Form Fields */}
        <form className="space-y-6">
          {(
            Object.entries(listingFieldLabels) as [
              keyof typeof listingSelectOptions,
              string
            ][]
          ).map(([field, label]) => {
            const isSelect = field in listingSelectOptions;

            return (
              <div key={field}>
                <label htmlFor={field} className="block font-bold mb-1">
                  {label}
                </label>

                {isSelect ? (
                  <select
                    name={field}
                    value={form[field as keyof typeof form]}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-[#B6D400] rounded-lg px-4 py-3 text-green-800 appearance-none"
                  >
                    <option value="">{`Select ${label.toLowerCase()}`}</option>
                    {listingSelectOptions[field].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name={field}
                    value={form[field as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={label}
                    className="w-full bg-white border-2 border-[#B6D400] rounded-lg px-4 py-3 text-green-800"
                  />
                )}
              </div>
            );
          })}

          {/* Continue Button */}
          {/* <button
            type="button"
            onClick={handleContinue}
            className="w-full bg-green-700 text-white font-semibold text-lg py-3 rounded-xl"
          >
            Continue
          </button> */}
          <FormButton label="Back" onClick={() => router.back()} />
          <FormButton label="Continue" onClick={handleContinue} />
        </form>
      </div>
    </main>
  );
}
