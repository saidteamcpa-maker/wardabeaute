// Morocco phone: leading 0, then 5/6/7/8, then 8 digits (10 total).
export const MOROCCO_PHONE_RE = /^0(5|6|7|8)[0-9]{8}$/;

export function isValidMoroccoPhone(value: string): boolean {
  return MOROCCO_PHONE_RE.test((value || "").trim());
}
