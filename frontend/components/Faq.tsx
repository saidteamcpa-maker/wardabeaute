export function Faq({ items }: { items: { q: string; r: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <details key={i} className="rounded-xl bg-white border border-brume p-4">
          <summary className="font-body font-medium text-profond cursor-pointer">{f.q}</summary>
          <p className="font-body text-brun mt-2 text-sm">{f.r}</p>
        </details>
      ))}
    </div>
  );
}
