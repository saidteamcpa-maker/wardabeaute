"use client";

import type { ProfitResult } from "@/lib/profit";
import { beLabel, fmtMAD2, fmtPctFrac, statusBadge } from "./fields";

function Block({
  title,
  be,
  current,
  status,
  impossible,
}: {
  title: string;
  be: string;
  current: string;
  status: ProfitResult["cplStatus"];
  impossible: boolean;
}) {
  const badge = statusBadge(status);
  return (
    <div className="rounded-2xl border border-profond/10 bg-white p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-profond/50">{title}</div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="text-[11px] text-profond/50">Seuil break-even</div>
          <div className="text-2xl font-bold text-profond">{be}</div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badge.cls}`}>{badge.label}</span>
      </div>
      <div className="mt-3 border-t border-profond/10 pt-3 text-sm text-profond/70">
        Valeur actuelle&nbsp;: <span className="font-semibold text-profond">{current}</span>
      </div>
    </div>
  );
}

export function BreakEvenDashboard({ r }: { r: ProfitResult }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Block
          title="Break-Even CPL"
          be={fmtMAD2(r.breakEvenCpl)}
          current={fmtMAD2(r.adsCost / Math.max(1, r.leads)) + " / lead"}
          status={r.cplStatus}
          impossible={r.impossible}
        />
        <Block
          title="Break-Even CR"
          be={beLabel(r.breakEvenCr, r.impossible)}
          current={fmtPctFrac(r.cr)}
          status={r.crStatus}
          impossible={r.impossible}
        />
        <Block
          title="Break-Even DR"
          be={beLabel(r.breakEvenDr, r.impossible)}
          current={fmtPctFrac(r.dr)}
          status={r.drStatus}
          impossible={r.impossible}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MarginCard title="Marge CPL" value={fmtMAD2(r.cplSafety)} positive={!isNaN(r.cplSafety) && r.cplSafety >= 0} />
        <MarginCard
          title="Marge CR"
          value={isNaN(r.crSafety) ? "—" : `${(r.crSafety * 100).toFixed(2)} pts`}
          positive={!isNaN(r.crSafety) && r.crSafety >= 0}
        />
        <MarginCard
          title="Marge DR"
          value={isNaN(r.drSafety) ? "—" : `${(r.drSafety * 100).toFixed(2)} pts`}
          positive={!isNaN(r.drSafety) && r.drSafety >= 0}
        />
      </div>
    </div>
  );
}

function MarginCard({ title, value, positive }: { title: string; value: string; positive: boolean }) {
  return (
    <div className="rounded-2xl border border-profond/10 bg-white p-4">
      <div className="text-xs font-medium text-profond/50">{title}</div>
      <div className={`mt-1 text-xl font-bold ${positive ? "text-emerald-600" : "text-rose-600"}`}>
        {positive ? "+" : ""}
        {value}
      </div>
    </div>
  );
}
