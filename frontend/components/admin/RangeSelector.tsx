"use client";

import { RANGES } from "@/lib/useAnalytics";

export function RangeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-brume overflow-hidden text-sm">
      {RANGES.map((r) => (
        <button
          key={r.key}
          onClick={() => onChange(r.key)}
          className={`px-3 py-1.5 font-body transition ${
            value === r.key ? "bg-warda text-white" : "bg-white text-gris hover:bg-petal/40"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
