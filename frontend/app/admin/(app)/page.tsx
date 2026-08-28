"use client";

import { useState } from "react";
import { useAnalytics } from "@/lib/useAnalytics";
import { RangeSelector } from "@/components/admin/RangeSelector";
import { KpiCard } from "@/components/admin/KpiCard";
import { RevenueChart } from "@/components/admin/Charts";
import { ProductTable } from "@/components/admin/ProductTable";
import { formatMAD, formatPct, formatNumber } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/admin-types";

export default function AdminOverview() {
  const [range, setRange] = useState("30d");
  const { data, loading } = useAnalytics(range);
  const ov = data?.overview;

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display text-profond">Overview</h1>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {loading && <p className="text-gris">Loading…</p>}

      {ov && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Revenue Generated" value={formatMAD(ov.revenuePotential)} sub="Confirmed+" />
            <KpiCard label="Revenue Collected (Delivered)" value={formatMAD(ov.revenueCollected)} accent="text-emerald-700" />
            <KpiCard label="Average Cart" value={formatMAD(ov.aov)} />
            <KpiCard label="Orders" value={formatNumber(ov.totalOrders)} />
            <KpiCard label="Confirmation Rate" value={formatPct(ov.confirmationRate)} accent="text-emerald-700" />
            <KpiCard label="Delivery Rate" value={formatPct(ov.deliveryRate)} accent="text-emerald-700" />
            <KpiCard label="Return Rate (RTO)" value={formatPct(ov.rtoRate)} accent="text-rose-700" />
            <KpiCard label="Conversion (orders / views)" value={formatPct(ov.conversionRate)} accent="text-violet-700" />
          </div>

          <div className="grid gap-4 mt-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart data={data!.series} />
            </div>
            <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5 transition-shadow duration-200 hover:shadow-card">
              <h3 className="font-display text-profond mb-3">Statuses</h3>
              <div className="space-y-1.5 text-sm">
                {Object.entries(ov.statusCounts).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gris">{STATUS_LABELS[k] ?? k}</span>
                    <span className="font-medium text-profond tabular-nums">{formatNumber(v as number)}</span>
                  </div>
                ))}
                {Object.keys(ov.statusCounts).length === 0 && <p className="text-gris">No orders.</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5 mt-4">
            <h3 className="font-display text-profond mb-3">Top Products</h3>
            <ProductTable products={data!.products.slice(0, 6)} />
          </div>
        </>
      )}
    </div>
  );
}
