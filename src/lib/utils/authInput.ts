export const passwordRules = {
  minLength: 8,
} as const;

export const sanitiseEmail = (value: string) => value.trim().toLowerCase();

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

export const isPasswordStrongEnough = (value: string) =>
  value.length >= passwordRules.minLength;
