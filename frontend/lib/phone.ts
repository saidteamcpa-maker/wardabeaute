/**
 * lib/phone.ts
 * Morocco phone validation — centralized.
 * Regex: 0[5-7]XXXXXXXX (10 digits, leading 0, second digit 5/6/7).
 * Note: validation.ts uses 0[5-8] — this file is the strict 0[5-7] variant per spec.
 */

export const MA_PHONE_RE = /^0[5-7][0-9]{8}$/;

/**
 * Validate Moroccan phone (strict 0[5-7]XXXXXXXX).
 * Trims whitespace, removes internal spaces/dashes before testing.
 */
export function isValidMaPhone(value: string): boolean {
  const normalized = (value || "").trim().replace(/[\s\-\.]/g, "");
  return MA_PHONE_RE.test(normalized);
}

/**
 * Normalize phone: strip spaces/dashes/dots, ensure leading 0.
 * Returns normalized string (e.g. "0612345678") or original trimmed if invalid.
 */
export function normalizeMaPhone(value: string): string {
  const raw = (value || "").trim().replace(/[\s\-\.]/g, "");
  // Also handle +212 / 212 prefix → 0
  if (/^\+212[5-7][0-9]{8}$/.test(raw)) return "0" + raw.slice(4);
  if (/^212[5-7][0-9]{8}$/.test(raw)) return "0" + raw.slice(3);
  return raw;
}

// Alias for compatibility with lib/validation.ts naming
export const isValidMoroccoPhone = isValidMaPhone;
export const MOROCCO_PHONE_RE = MA_PHONE_RE;
