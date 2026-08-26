"use client";

import { useMemo, useState } from "react";
import { DEFAULT_INPUTS, computeProfit, type ProfitInputs } from "@/lib/profit";
import { NumberField, fmtMAD } from "@/components/admin/profit/fields";
import { BreakEvenDashboard } from "@/components/admin/profit/BreakEvenDashboard";
import { FunnelSummary } from "@/components/admin/profit/FunnelSummary";
import { Sensitivity } from "@/components/admin/profit/Sensitivity";
import { Scenarios } from "@/components/admin/profit/Scenarios";

export default function ProfitSimulatorPage() {
  const [inputs, setInputs] = useState<ProfitInputs>({ ...DEFAULT_INPUTS });
  const [loadingData, setLoadingData] = useState(false);

  const r = useMemo(() => computeProfit(inputs), [inputs]);

  const set = (key: keyof ProfitInputs) => (v: number) =>
    setInputs((p) => ({ ...p, [key]: v }));

  const loadStoreData = async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/admin/analytics?range=30d");
      if (!res.ok) return;
      const data = await res.json();
      const o = data?.overview ?? {};
      setInputs((p) => ({
        ...p,
        cr: typeof o.confirmationRate === "number" ? o.confirmationRate : p.cr,
        dr: typeof o.deliveryRate === "number" ? o.deliveryRate : p.dr,
        sellingPrice: typeof o.aov === "number" && o.aov > 0 ? o.aov : p.sellingPrice,
      }));
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-profond">Profitability Simulator</h1>
          <p className="mt-1 text-sm text-profond/60">
            Instantly calculate your break-even thresholds for CPL / CR / DR. No real data is modified.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadStoreData}
            disabled={loadingData}
            className="rounded-lg border border-warda px-3 py-2 text-sm font-medium text-warda hover:bg-warda/10 disabled:opacity-50"
          >
            {loadingData ? "Loading…" : "Use store data"}
          </button>
          <button
            onClick={() => setInputs({ ...DEFAULT_INPUTS })}
            className="rounded-lg border border-profond/15 px-3 py-2 text-sm font-medium text-profond/70 hover:bg-profond/5"
          >
            Reset
          </button>
        </div>
      </div>

      {r.impossible && (
        <Banner kind="error" title="BREAK-EVEN IMPOSSIBLE">
          Selling price ≤ Product cost + Service fees + Other variable costs. No CPL/CR/DR can make this profitable.
        </Banner>
      )}
      {!r.impossible && r.breakEvenCr > 1 && (
        <Banner kind="warn" title="BREAK-EVEN CR UNREACHABLE">
          The minimum required confirmation rate exceeds 100% with the current economics.
        </Banner>
      )}
      {!r.impossible && r.breakEvenDr > 1 && (
        <Banner kind="warn" title="BREAK-EVEN DR UNREACHABLE">
          The minimum required delivery rate exceeds 100% with the current economics.
        </Banner>
      )}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4 rounded-2xl border border-profond/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-profond">Parameters</h2>
          <Group title="Traffic">
            <NumberField label="Leads" value={inputs.leads} onChange={set("leads")} />
            <NumberField label="Ads CPL" value={inputs.adsCpl} onChange={set("adsCpl")} suffix="MAD" />
          </Group>
          <Group title="COD Funnel">
            <NumberField label="Confirmation Rate (CR)" value={Math.round(inputs.cr * 100)} onChange={(v) => set("cr")(v / 100)} suffix="%" />
            <NumberField label="Delivery Rate (DR)" value={Math.round(inputs.dr * 100)} onChange={(v) => set("dr")(v / 100)} suffix="%" />
          </Group>
          <Group title="Product economics">
            <NumberField label="Selling price" value={inputs.sellingPrice} onChange={set("sellingPrice")} suffix="MAD" />
            <NumberField label="Product cost" value={inputs.productCost} onChange={set("productCost")} suffix="MAD" />
            <NumberField label="Service / delivery fee" value={inputs.serviceFee} onChange={set("serviceFee")} suffix="MAD" />
            <NumberField label="Lead fee" value={inputs.leadFee} onChange={set("leadFee")} suffix="MAD" />
            <NumberField label="Other variable cost / delivered" value={inputs.otherVariableCost} onChange={set("otherVariableCost")} suffix="MAD" />
            <NumberField label="Other fixed costs" value={inputs.otherFixedCosts} onChange={set("otherFixedCosts")} suffix="MAD" />
          </Group>
        </div>

        <div className="space-y-8">
          <section>
            <SectionTitle>Break-Even</SectionTitle>
            <BreakEvenDashboard r={r} />
          </section>

          <section>
            <SectionTitle>Financial summary & funnel</SectionTitle>
            <FunnelSummary inputs={inputs} r={r} />
          </section>

          <section>
            <SectionTitle>Sensitivity & matrix</SectionTitle>
            <Sensitivity inputs={inputs} />
          </section>

          <section>
            <SectionTitle>Scenario comparison</SectionTitle>
            <Scenarios current={inputs} />
          </section>
        </div>
      </div>
    </div>
  );
}

type BannerKind = "error" | "warn";

function Banner({ kind, title, children }: { kind: BannerKind; title: string; children: React.ReactNode }) {
  const cls =
    kind === "error"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : "border-amber-200 bg-amber-50 text-amber-800";
  return (
    <div className={`rounded-xl border px-4 py-3 ${cls}`}>
      <div className="text-sm font-bold">{title}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 border-t border-profond/10 pt-4 first:border-t-0 first:pt-0">
      <div className="text-xs font-semibold uppercase tracking-wide text-profond/40">{title}</div>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-lg font-semibold text-profond">{children}</h2>;
}
