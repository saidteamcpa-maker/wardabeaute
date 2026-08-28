"use client";

import { useState } from "react";
import { useAnalytics } from "@/lib/useAnalytics";
import { RangeSelector } from "@/components/admin/RangeSelector";
import { TrafficChart, RevenueChart, BreakdownPie } from "@/components/admin/Charts";
import { ProductTable } from "@/components/admin/ProductTable";
import { formatNumber } from "@/lib/format";
import { SOURCE_LABELS } from "@/lib/admin-types";

const FUNNEL_STEPS = [
  { key: "pageViews", label: "Page views" },
  { key: "addToCarts", label: "Add to carts" },
  { key: "beginCheckouts", label: "Begin checkout" },
  { key: "orders", label: "Orders" },
  { key: "confirmed", label: "Confirmed+" },
  { key: "delivered", label: "Delivered" },
] as const;

export default function AdminAnalytics() {
  const [range, setRange] = useState("30d");
  const { data, loading } = useAnalytics(range);
  const funnel = data?.funnel;

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display text-profond">Analytics & COD</h1>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {loading && <p className="text-gris">Loading…</p>}

      {data && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <TrafficChart data={data.series.map((s: any) => ({ date: s.date, pageViews: s.pageViews }))} />
            <RevenueChart data={data.series} />
          </div>

          <div className="grid gap-4 mt-4 lg:grid-cols-2">
            <BreakdownPie title="Sources (orders)" data={data.sources} labelMap={SOURCE_LABELS} />
            <BreakdownPie title="Devices (orders)" data={data.devices} />
          </div>

          <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5 mt-4">
            <h3 className="font-display text-profond mb-3">COD Funnel</h3>
            {funnel && (
              <div className="space-y-2">
                {FUNNEL_STEPS.map((step) => {
                  const val = (funnel as any)[step.key] as number;
                  const max = (funnel as any).pageViews || 1;
                  const pct = Math.max(2, Math.round((val / max) * 100));
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div className="w-36 text-sm text-gris shrink-0">{step.label}</div>
                      <div className="flex-1 h-6 bg-petal/40 rounded-lg overflow-hidden">
                        <div className="h-6 bg-warda rounded-lg transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="w-16 text-right text-sm font-medium text-profond">{formatNumber(val)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5 mt-4">
            <h3 className="font-display text-profond mb-3">Product performance</h3>
            <ProductTable products={data.products} />
          </div>
        </>
      )}
    </div>
  );
}
