type FormData = Record<string, string>;
type FieldLabels = Record<string, string>;

export const validateForm = (
  form: FormData,
  fieldLabels: FieldLabels
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [field, label] of Object.entries(fieldLabels)) {
    const value = form[field]?.trim();

    if (!value) {
      errors[field] = `${label} is required.`;
    } else if (field === "price" && !/^\d+(\.\d{1,2})?$/.test(value)) {
      errors[field] = `${label} must be a valid number (e.g., 12.99).`;
    }
  }

  return errors;
};
