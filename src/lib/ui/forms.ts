export type Focusable = { focus: () => void } | null;

/** Show an error message and optionally focus a field (keeps pages DRY). */
export function showError(
  message: string,
  focusEl?: Focusable,
  setError?: (msg: string | null) => void
) {
  if (setError) setError(message);
  focusEl?.focus();
}

/** Generate a stable a11y error id for a form (screen readers). */
export function makeErrorId(formName: string) {
  return `${formName}-error`;
}
