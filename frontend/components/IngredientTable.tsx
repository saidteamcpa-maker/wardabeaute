export function IngredientTable({
  items,
}: {
  items: { name: string; role: string; origin?: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-brume">
      <table className="w-full text-sm font-body border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-brume/60 to-petal text-profond">
            <th className="text-left p-3.5 font-medium">Ingrédient</th>
            <th className="text-left p-3.5 font-medium">Rôle</th>
            <th className="text-left p-3.5 font-medium">Origine</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className={`border-b border-brume/50 transition-colors duration-150 hover:bg-petal/40 ${i % 2 === 0 ? "bg-white" : "bg-petal/20"}`}>
              <td className="p-3.5 font-medium text-profond">{it.name}</td>
              <td className="p-3.5 text-brun">{it.role}</td>
              <td className="p-3.5 text-gris">{it.origin || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
