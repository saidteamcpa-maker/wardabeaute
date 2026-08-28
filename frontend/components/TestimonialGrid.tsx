export function TestimonialGrid({ items }: { items: { text: string; name: string; stars: number }[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {items.map((t, i) => (
        <div key={i} className="rounded-2xl bg-white border border-brume p-5 shadow-soft transition-shadow duration-200 hover:shadow-card">
          <div className="text-champagne text-sm mb-2">{"★".repeat(t.stars)}</div>
          <p className="font-body text-brun text-sm">“{t.text}”</p>
          <p className="font-body text-gris text-xs mt-3">— {t.name}</p>
        </div>
      ))}
    </div>
  );
}
