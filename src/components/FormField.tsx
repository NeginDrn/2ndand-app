// src/components/FormField.tsx

import type { ChangeEvent } from "react";

type FormFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  options?: string[];
};

export default function FormField({
  name,
  label,
  value,
  onChange,
  error,
  options,
}: FormFieldProps) {
  const isSelect = Array.isArray(options);

  return (
    <div>
      <label htmlFor={name} className="block font-bold mb-1">
        {label}
      </label>

      {isSelect ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full bg-white border-2 ${
            error ? "border-red-500" : "border-[#B6D400]"
          } rounded-lg px-4 py-3 text-green-800 appearance-none`}
        >
          <option value="">{`Select ${label.toLowerCase()}`}</option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={name === "price" ? "number" : "text"}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={label}
          className={`w-full bg-white border-2 ${
            error ? "border-red-500" : "border-[#B6D400]"
          } rounded-lg px-4 py-3 text-green-800`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}

      {error && (
        <p
          id={`${name}-error`}
          className="text-red-600 text-sm mt-1"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}
