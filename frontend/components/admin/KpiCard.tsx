export function KpiCard({
  label,
  value,
  sub,
  accent = "text-profond",
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5 transition-shadow duration-200 hover:shadow-card">
      <div className="text-xs uppercase tracking-wide text-gris mb-1">{label}</div>
      <div className={`text-xl sm:text-2xl font-display font-semibold tabular-nums ${accent}`}>{value}</div>
      {sub && <div className="text-xs text-gris mt-1">{sub}</div>}
    </div>
  );
}

export function KpiSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5">
      <div className="skeleton h-3 w-20 rounded mb-2" />
      <div className="skeleton h-7 w-16 rounded" />
    </div>
  );
}
