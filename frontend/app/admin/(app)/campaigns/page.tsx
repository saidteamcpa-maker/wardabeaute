"use client";

import { useState } from "react";
import { useAnalytics } from "@/lib/useAnalytics";
import { RangeSelector } from "@/components/admin/RangeSelector";
import { KpiCard } from "@/components/admin/KpiCard";
import { formatMAD, formatPct, formatNumber } from "@/lib/format";

export default function AdminCampaigns() {
  const [range, setRange] = useState("30d");
  const { data, loading } = useAnalytics(range);
  const campaigns = data?.campaigns;
  const sources = data?.sources;

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display text-profond">Campaigns & attribution</h1>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {loading && <p className="text-gris">Loading…</p>}

      {campaigns && (
        <>
          <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5">
            <h3 className="font-display text-profond mb-1">By campaign (UTM)</h3>
            <p className="text-xs text-gris mb-3">
              Orders attributed via <code>utm_campaign</code>. Revenue corresponds to the potential of active orders. Connect your ad spend to calculate ROAS.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gris border-b border-brume">
                    <th className="py-2 pr-4 font-medium">Campaign</th>
                    <th className="py-2 pr-4 font-medium text-right">Orders</th>
                    <th className="py-2 pr-4 font-medium text-right">Revenue</th>
                    <th className="py-2 pr-4 font-medium text-right">Average cart</th>
                    <th className="py-2 font-medium text-right">Confirmation</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c: any) => (
                    <tr key={c.key} className="border-b border-brume/50">
                      <td className="py-2 pr-4">{c.label === "direct" ? <span className="text-gris">(direct / no campaign)</span> : c.label}</td>
                      <td className="py-2 pr-4 text-right">{formatNumber(c.orders)}</td>
                      <td className="py-2 pr-4 text-right">{formatMAD(c.revenue)}</td>
                      <td className="py-2 pr-4 text-right">{formatMAD(c.aov)}</td>
                      <td className="py-2 text-right">{formatPct(c.confirmationRate)}</td>
                    </tr>
                  ))}
                  {campaigns.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-3 text-gris">
                        No data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {sources && (
            <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5 mt-4">
              <h3 className="font-display text-profond mb-3">By channel (source)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gris border-b border-brume">
                      <th className="py-2 pr-4 font-medium">Source</th>
                      <th className="py-2 pr-4 font-medium text-right">Orders</th>
                      <th className="py-2 pr-4 font-medium text-right">Share</th>
                      <th className="py-2 font-medium text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sources.map((s: any) => (
                      <tr key={s.label} className="border-b border-brume/50">
                        <td className="py-2 pr-4">{s.label}</td>
                        <td className="py-2 pr-4 text-right">{formatNumber(s.count)}</td>
                        <td className="py-2 pr-4 text-right">{formatPct(s.share)}</td>
                        <td className="py-2 text-right">{formatMAD(s.revenue)}</td>
                      </tr>
                    ))}
                    {sources.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-3 text-gris">
                          No data.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
