export function TestimonialGrid({ items }: { items: { text: string; name: string; stars: number }[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {items.map((t, i) => (
        <div key={i} className="rounded-2xl bg-white border border-brume p-5 shadow-elevated transition-all duration-350 hover:shadow-glow hover:-translate-y-1">
          <div className="text-champagne text-sm mb-2 tracking-tight">{"★".repeat(t.stars)}</div>
          <p className="font-body text-brun text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
          <p className="font-body text-gris text-xs mt-3 font-medium">&mdash; {t.name}</p>
        </div>
      ))}
    </div>
  );
}
