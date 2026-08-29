export function Faq({ items }: { items: { q: string; r: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <details key={i} className="group rounded-xl bg-white border border-brume hover:border-warda/30 transition-colors duration-250">
          <summary className="font-body font-medium text-profond cursor-pointer px-5 py-4 flex items-center justify-between gap-3 [&::-webkit-details-marker]:hidden [&::marker]:hidden list-none">
            <span>{f.q}</span>
            <span className="shrink-0 w-6 h-6 rounded-full bg-petal flex items-center justify-center text-warda text-sm transition-transform duration-300 ease-out-expo group-open:rotate-45">+</span>
          </summary>
          <div className="px-5 pb-4 text-sm font-body text-brun leading-relaxed border-t border-brume/50 pt-3">{f.r}</div>
        </details>
      ))}
    </div>
  );
}
