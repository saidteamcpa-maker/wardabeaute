"use client";

import { computeProfit, type ProfitInputs } from "@/lib/profit";
import { fmtMAD, fmtMAD2, fmtNum, fmtPct2 } from "./fields";

const BASE: ProfitInputs = {
  leads: 1000,
  adsCpl: 27,
  cr: 0.7,
  dr: 0.5,
  sellingPrice: 280,
  productCost: 50,
  serviceFee: 63,
  leadFee: 2,
  otherVariableCost: 0,
  otherFixedCosts: 0,
};

const OPTIMISTIC: ProfitInputs = { ...BASE, adsCpl: 22, cr: 0.75, dr: 0.6 };
const PESSIMISTIC: ProfitInputs = { ...BASE, adsCpl: 40, cr: 0.6, dr: 0.4 };

export function Scenarios({ current }: { current: ProfitInputs }) {
  const data = [
    { name: "Actuel", inputs: current },
    { name: "Base", inputs: BASE },
    { name: "Optimiste", inputs: OPTIMISTIC },
    { name: "Pessimiste", inputs: PESSIMISTIC },
  ].map((s) => ({ name: s.name, r: computeProfit(s.inputs) }));

  return (
    <div className="overflow-x-auto rounded-2xl border border-profond/10 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-profond/10 text-xs uppercase text-profond/50">
            <th className="px-4 py-3 text-left">Scénario</th>
            <th className="px-4 py-3 text-right">Confirmés</th>
            <th className="px-4 py-3 text-right">Livrés</th>
            <th className="px-4 py-3 text-right">Ventes</th>
            <th className="px-4 py-3 text-right">Coûts</th>
            <th className="px-4 py-3 text-right">Profit Net</th>
            <th className="px-4 py-3 text-right">Marge</th>
            <th className="px-4 py-3 text-right">BE CPL</th>
            <th className="px-4 py-3 text-right">BE CR</th>
            <th className="px-4 py-3 text-right">BE DR</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.name} className="border-t border-profond/5">
              <td className="px-4 py-3 font-semibold text-profond">{d.name}</td>
              <td className="px-4 py-3 text-right tabular-nums">{fmtNum(d.r.confirmed)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{fmtNum(d.r.delivered)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{fmtMAD(d.r.totalSales)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{fmtMAD(d.r.totalCharges)}</td>
              <td className={`px-4 py-3 text-right tabular-nums font-semibold ${d.r.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {fmtMAD(d.r.netProfit)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{isNaN(d.r.profitMargin) ? "—" : fmtPct2(d.r.profitMargin)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{fmtMAD2(d.r.breakEvenCpl)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{isNaN(d.r.breakEvenCr) ? "—" : fmtPct2(d.r.breakEvenCr)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{isNaN(d.r.breakEvenDr) ? "—" : fmtPct2(d.r.breakEvenDr)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
