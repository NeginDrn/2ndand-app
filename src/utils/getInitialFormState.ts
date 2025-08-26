export const getInitialFormState = (fieldLabels: Record<string, string>) =>
  Object.keys(fieldLabels).reduce((acc, key) => {
    acc[key as keyof typeof fieldLabels] = "";
    return acc;
  }, {} as Record<keyof typeof fieldLabels, string>);
