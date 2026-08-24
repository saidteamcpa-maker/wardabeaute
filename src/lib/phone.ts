export function normalizeMaPhone(raw: string): string {
  let v = raw.replace(/[\s.\-()]/g, '');
  if (v.startsWith('+212')) v = '0' + v.slice(4);
  if (v.startsWith('00212')) v = '0' + v.slice(5);
  return v;
}

export function isValidMaPhone(raw: string): boolean {
  const v = normalizeMaPhone(raw);
  return /^0[5-7]\d{8}$/.test(v);
}

export function formatMaPhoneDisplay(raw: string): string {
  const v = normalizeMaPhone(raw);
  if (v.length !== 10) return v;
  return `+212 ${v[1]} ${v.slice(2, 4)} ${v.slice(4, 6)} ${v.slice(6, 8)} ${v.slice(8)}`;
}
