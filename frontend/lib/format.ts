export function formatMAD(n: number): string {
  return `${Math.round(n).toLocaleString("fr-FR")} MAD`;
}

export function formatPct(x: number): string {
  return `${(x * 100).toFixed(1)}%`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("fr-FR");
}
