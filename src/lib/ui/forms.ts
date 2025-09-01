export type Focusable = { focus: () => void } | null;

/** Show an error message and optionally focus a field (keeps pages DRY). */
export function showError(
  setError: (msg: string | null) => void,
  message: string,
  focusEl?: Focusable
) {
  setError(message);
  focusEl?.focus();
}

/** Generate a stable a11y error id for a form (screen readers). */
export function makeErrorId(formName: string) {
  return `${formName}-error`;
}
