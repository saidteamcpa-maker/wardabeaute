export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-display text-profond mb-4">{title}</h1>
      <div className="bg-white rounded-2xl border border-brume p-10 text-center text-gris">
        Module en préparation — livré dans une phase ultérieure (aucune donnée fictive).
      </div>
    </div>
  );
}
