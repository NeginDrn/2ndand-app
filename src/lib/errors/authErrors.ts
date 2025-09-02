export const AuthErrorMessages = {
  emailAlreadyRegistered:
    "This email is already registered. Try logging in instead.",
  passwordRequirements: "Your password doesn’t meet the requirements.",
  genericSignupError: "We couldn’t sign you up. Please try again.",
  invalidCredentials: "Incorrect email or password. Please try again.",
  genericLoginError: "We couldn’t sign you in. Please try again.",
} as const;

export const ValidationMessages = {
  emailRequired: "Please enter your email address.",
  emailInvalid: "Please enter a valid email address.",
  passwordRequired: "Please enter your password.",
  passwordMinLength: "Your password must be at least 8 characters long.",
  passwordsDoNotMatch: "Passwords do not match.",
} as const;

export const getAuthErrorMessage = (raw?: string) => {
  const m = (raw || "").toLowerCase();

  // Signup-specific
  if (m.includes("already") && m.includes("registered")) {
    return AuthErrorMessages.emailAlreadyRegistered;
  }
  if (m.includes("password")) {
    return AuthErrorMessages.passwordRequirements;
  }

  // Login-specific
  if (m.includes("invalid") || m.includes("credentials")) {
    return AuthErrorMessages.invalidCredentials;
  }
  if (m.includes("signin") || m.includes("login")) {
    return AuthErrorMessages.genericLoginError;
  }

  // Fallback
  return AuthErrorMessages.genericSignupError;
};
