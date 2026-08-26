"use client";

import { formatMAD, formatPct, formatNumber } from "@/lib/format";
import type { ProfitResult } from "@/lib/profit";

export function num(v: string): number {
  const n = parseFloat(v.replace(",", "."));
  return isNaN(n) ? 0 : n;
}

export function fmtMAD(n: number): string {
  return isNaN(n) ? "—" : formatMAD(n);
}
export function fmtMAD2(n: number): string {
  if (isNaN(n)) return "—";
  return `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;
}
export function fmtPctFrac(n: number): string {
  return isNaN(n) ? "—" : formatPct(n);
}
export function fmtPct2(n: number): string {
  if (isNaN(n)) return "—";
  const v = (n * 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${v}%`;
}
export function fmtNum(n: number): string {
  return isNaN(n) ? "—" : formatNumber(Math.round(n));
}

export function statusBadge(s: ProfitResult["cplStatus"]): { label: string; cls: string } {
  switch (s) {
    case "profit":
      return { label: "PROFITABLE", cls: "bg-emerald-100 text-emerald-700" };
    case "even":
      return { label: "BREAK-EVEN", cls: "bg-amber-100 text-amber-700" };
    case "loss":
      return { label: "LOSS", cls: "bg-rose-100 text-rose-700" };
    default:
      return { label: "IMPOSSIBLE", cls: "bg-rose-100 text-rose-700" };
  }
}

export function beLabel(value: number, impossible: boolean): string {
  if (impossible || isNaN(value)) return "IMPOSSIBLE";
  if (value > 1) return "UNREACHABLE";
  return fmtPct2(Math.max(0, value));
}

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-profond/70">{label}</span>
      <div className="mt-1 flex items-center rounded-lg border border-profond/15 bg-white focus-within:border-warda">
        <input
          type="number"
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(num(e.target.value))}
          className="w-full min-w-0 bg-transparent px-3 py-2 text-sm outline-none"
        />
        {suffix ? <span className="px-2 text-xs text-profond/40">{suffix}</span> : null}
      </div>
      {hint ? <span className="mt-0.5 block text-[11px] text-profond/40">{hint}</span> : null}
    </label>
  );
}
