export function IngredientTable({
  items,
}: {
  items: { name: string; role: string; origin?: string }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body border-collapse">
        <thead>
          <tr className="bg-brume text-brun">
            <th className="text-left p-3">Ingrédient</th>
            <th className="text-left p-3">Rôle</th>
            <th className="text-left p-3">Origine</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="border-b border-brume">
              <td className="p-3 font-medium text-profond">{it.name}</td>
              <td className="p-3 text-brun">{it.role}</td>
              <td className="p-3 text-gris">{it.origin || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
