export function Faq({ items }: { items: { q: string; r: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <details key={i} className="group rounded-xl bg-white border border-brume hover:border-warda/30 transition-colors duration-250 open:shadow-subtle">
          <summary className="font-body font-medium text-profond cursor-pointer px-5 py-4 flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden [&::marker]:hidden list-none focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none rounded-xl">
            <span className="leading-snug pr-2">{f.q}</span>
            <span className="shrink-0 w-7 h-7 rounded-full bg-petal border border-brume/50 flex items-center justify-center text-warda text-sm font-medium transition-all duration-300 ease-out-expo group-open:rotate-45 group-open:bg-warda group-open:text-white group-open:border-warda">+</span>
          </summary>
          <div className="px-5 pb-4 text-sm font-body text-brun leading-relaxed border-t border-brume/50 pt-3.5">{f.r}</div>
        </details>
      ))}
    </div>
  );
}
