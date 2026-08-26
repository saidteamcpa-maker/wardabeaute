export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-display text-profond mb-4">{title}</h1>
      <div className="bg-white rounded-2xl border border-brume p-10 text-center text-gris">
        Module under preparation — delivered in a later phase (no mock data).
      </div>
    </div>
  );
}
