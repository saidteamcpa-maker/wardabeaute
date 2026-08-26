import { formatMAD, formatNumber } from "@/lib/format";

export function ProductTable({ products }: { products: { slug: string; name: string; units: number; revenue: number; orders: number }[] }) {
  if (!products || products.length === 0) {
    return <p className="text-sm text-gris">Aucune vente sur la période.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gris border-b border-brume">
            <th className="py-2 pr-4 font-medium">Produit</th>
            <th className="py-2 pr-4 font-medium text-right">Unités</th>
            <th className="py-2 pr-4 font-medium text-right">Commandes</th>
            <th className="py-2 font-medium text-right">CA</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.slug} className="border-b border-brume/50">
              <td className="py-2 pr-4">{p.name}</td>
              <td className="py-2 pr-4 text-right">{formatNumber(p.units)}</td>
              <td className="py-2 pr-4 text-right">{formatNumber(p.orders)}</td>
              <td className="py-2 text-right">{formatMAD(p.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
