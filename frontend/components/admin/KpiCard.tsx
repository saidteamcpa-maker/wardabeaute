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
