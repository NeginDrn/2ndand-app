// src/components/FormButton.tsx
import type { ButtonHTMLAttributes } from "react";

type FormButtonProps = {
  label: string;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  className?: string;
};

export default function FormButton({
  label,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: FormButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={[
        "w-full rounded-xl px-4 py-3 font-semibold text-white",
        "bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/40",
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:bg-green-800 active:translate-y-px",
        className,
      ].join(" ")}
    >
      {label}
    </button>
  );
}
