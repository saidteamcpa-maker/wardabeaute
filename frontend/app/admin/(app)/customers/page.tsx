"use client";

import { useState } from "react";
import { useAnalytics } from "@/lib/useAnalytics";
import { RangeSelector } from "@/components/admin/RangeSelector";
import { KpiCard } from "@/components/admin/KpiCard";
import { formatMAD, formatPct, formatNumber } from "@/lib/format";

export default function AdminCustomers() {
  const [range, setRange] = useState("30d");
  const { data, loading } = useAnalytics(range);
  const aud = data?.audience;

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display text-profond">Customers & geography</h1>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {loading && <p className="text-gris">Loading…</p>}

      {aud && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Total customers" value={formatNumber(aud.totalCustomers)} />
            <KpiCard label="Repeat customers" value={formatNumber(aud.repeatCustomers)} accent="text-emerald-700" />
            <KpiCard label="Repeat rate" value={formatPct(aud.repeatRate)} accent="text-emerald-700" />
            <KpiCard label="Average LTV" value={formatMAD(aud.avgLtv)} />
          </div>

          <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5 mt-4">
            <h3 className="font-display text-profond mb-3">Performance by city (COD)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gris border-b border-brume">
                    <th className="py-2 pr-4 font-medium">City</th>
                    <th className="py-2 pr-4 font-medium text-right">Orders</th>
                    <th className="py-2 pr-4 font-medium text-right">Revenue</th>
                    <th className="py-2 pr-4 font-medium text-right">Delivery</th>
                    <th className="py-2 pr-4 font-medium text-right">RTO</th>
                    <th className="py-2 font-medium text-right">Confirmation</th>
                  </tr>
                </thead>
                <tbody>
                  {aud.cities.map((c: any) => (
                    <tr key={c.city} className="border-b border-brume/50">
                      <td className="py-2 pr-4">{c.city}</td>
                      <td className="py-2 pr-4 text-right">{formatNumber(c.orders)}</td>
                      <td className="py-2 pr-4 text-right">{formatMAD(c.revenue)}</td>
                      <td className="py-2 pr-4 text-right text-emerald-700">{formatPct(c.deliveryRate)}</td>
                      <td className="py-2 pr-4 text-right text-rose-700">{formatPct(c.rtoRate)}</td>
                      <td className="py-2 text-right">{formatPct(c.confirmationRate)}</td>
                    </tr>
                  ))}
                  {aud.cities.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-3 text-gris">
                        No data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5 mt-4">
            <h3 className="font-display text-profond mb-3">Top customers (Revenue)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gris border-b border-brume">
                    <th className="py-2 pr-4 font-medium">Phone</th>
                    <th className="py-2 pr-4 font-medium text-right">Commandes</th>
                    <th className="py-2 font-medium text-right">CA</th>
                  </tr>
                </thead>
                <tbody>
                  {aud.topCustomers.map((c: any) => (
                    <tr key={c.phone} className="border-b border-brume/50">
                      <td className="py-2 pr-4">{c.phone}</td>
                      <td className="py-2 pr-4 text-right">{formatNumber(c.orders)}</td>
                      <td className="py-2 text-right">{formatMAD(c.revenue)}</td>
                    </tr>
                  ))}
                  {aud.topCustomers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-3 text-gris">
                        No data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
