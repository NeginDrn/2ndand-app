// src/components/FormButton.tsx

type FormButtonProps = {
  label: string;
  onClick: () => void;
};

export default function FormButton({ label, onClick }: FormButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-green-700 text-white font-semibold text-lg py-3 rounded-xl"
    >
      {label}
    </button>
  );
}
