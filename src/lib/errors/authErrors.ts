export const AuthErrorMessages = {
  emailAlreadyRegistered:
    "This email is already registered. Try logging in instead.",
  passwordRequirements: "Your password doesn’t meet the requirements.",
  genericSignupError: "We couldn’t sign you up. Please try again.",
} as const;

export const ValidationMessages = {
  emailRequired: "Please enter your email address.",
  emailInvalid: "Please enter a valid email address.",
  passwordMinLength: "Your password must be at least 8 characters long.",
  passwordsDoNotMatch: "Passwords do not match.",
} as const;

export const getAuthErrorMessage = (raw?: string) => {
  const m = (raw || "").toLowerCase();

  if (m.includes("already") && m.includes("registered")) {
    return AuthErrorMessages.emailAlreadyRegistered;
  }
  if (m.includes("password")) {
    return AuthErrorMessages.passwordRequirements;
  }

  return AuthErrorMessages.genericSignupError;
};
