"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["#b08d57", "#7c9c7e", "#d9a05b", "#8a6f9e", "#c96d6d", "#6b8fb5", "#caa46a", "#9c8aa5"];

export function RevenueChart({ data }: { data: { date: string; revenue: number; orders: number }[] }) {
  return (
    <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5">
      <h3 className="font-display text-profond mb-3">Chiffre d'affaires & commandes</h3>
      {data.length === 0 ? (
        <p className="text-sm text-gris">Aucune donnée sur la période.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ left: -8, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area yAxisId="left" type="monotone" dataKey="revenue" name="CA (MAD)" fill="#b08d57" fillOpacity={0.22} stroke="#b08d57" />
            <Line yAxisId="right" type="monotone" dataKey="orders" name="Commandes" stroke="#7c9c7e" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function TrafficChart({ data }: { data: { date: string; pageViews: number }[] }) {
  return (
    <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5">
      <h3 className="font-display text-profond mb-3">Trafic (vues de pages)</h3>
      {data.length === 0 ? (
        <p className="text-sm text-gris">Aucune donnée sur la période.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ left: -8, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="pageViews" name="Vues" fill="#6b8fb5" fillOpacity={0.22} stroke="#6b8fb5" />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function BreakdownPie({
  title,
  data,
  labelMap,
}: {
  title: string;
  data: { key: string; label: string; count: number; revenue: number }[];
  labelMap?: Record<string, string>;
}) {
  const rows = data.map((d) => ({ name: labelMap?.[d.key] || d.label, value: d.count }));
  return (
    <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5">
      <h3 className="font-display text-profond mb-3">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-gris">Aucune donnée.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={rows} dataKey="value" nameKey="name" outerRadius={85} label={(e: any) => `${e.name}: ${e.value}`}>
              {rows.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
