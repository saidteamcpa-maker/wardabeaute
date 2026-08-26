"use client";

import type { ProfitInputs, ProfitResult } from "@/lib/profit";
import { fmtMAD, fmtMAD2, fmtNum, fmtPct2, fmtPctFrac } from "./fields";

export function FunnelSummary({ inputs, r }: { inputs: ProfitInputs; r: ProfitResult }) {
  const steps = [
    { label: "Leads", value: r.leads, color: "bg-warda" },
    { label: "Confirmés (CR)", value: r.confirmed, color: "bg-violet-500" },
    { label: "Livrés (DR)", value: r.delivered, color: "bg-emerald-500" },
  ];
  const max = Math.max(1, r.leads);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-profond/10 bg-white p-5">
        <div className="text-sm font-semibold text-profond">Entonnoir COD</div>
        <div className="mt-4 space-y-3">
          {steps.map((s, i) => (
            <div key={s.label}>
              <div className="mb-1 flex justify-between text-xs text-profond/60">
                <span>{s.label}</span>
                <span className="font-semibold text-profond">{fmtNum(s.value)}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-profond/10">
                <div className={`h-3 rounded-full ${s.color}`} style={{ width: `${(s.value / max) * 100}%` }} />
              </div>
              {i < steps.length - 1 ? (
                <div className="pl-1 text-[11px] text-profond/40">
                  {i === 0 ? `CR ${fmtPctFrac(r.cr)}` : `DR ${fmtPctFrac(r.dr)}`}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-profond/10 bg-white">
        <table className="w-full text-sm">
          <tbody>
            <SummaryRow label="Leads" value={fmtNum(r.leads)} />
            <SummaryRow label="Confirmés" value={fmtNum(r.confirmed)} />
            <SummaryRow label="Livrés" value={fmtNum(r.delivered)} />
            <SummaryRow label="CR" value={fmtPctFrac(r.cr)} />
            <SummaryRow label="DR" value={fmtPctFrac(r.dr)} />
            <SummaryRow label="Coût Ads" value={fmtMAD(r.adsCost)} />
            <SummaryRow label="Coût Produit" value={fmtMAD(r.productCostTotal)} />
            <SummaryRow label="Frais Service" value={fmtMAD(r.serviceFees)} />
            <SummaryRow label="Frais Lead" value={fmtMAD(r.leadFees)} />
            <SummaryRow label="Autres variables" value={fmtMAD(r.otherVariableTotal)} />
            <SummaryRow label="Charges Totales" value={fmtMAD(r.totalCharges)} bold />
            <SummaryRow label="Prix de Vente" value={fmtMAD(inputs.sellingPrice)} />
            <SummaryRow label="Ventes Totales" value={fmtMAD(r.totalSales)} bold />
            <SummaryRow
              label="Profit Net"
              value={fmtMAD(r.netProfit)}
              bold
              accent={r.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"}
            />
            <SummaryRow
              label="Marge"
              value={isNaN(r.profitMargin) ? "—" : fmtPct2(r.profitMargin)}
              accent={!isNaN(r.profitMargin) && r.profitMargin >= 0 ? "text-emerald-600" : "text-rose-600"}
            />
            <SummaryRow label="Profit / Lead" value={fmtMAD2(r.profitPerLead)} />
            <SummaryRow label="Profit / Confirmé" value={fmtMAD2(r.profitPerConfirmed)} />
            <SummaryRow label="Profit / Livré" value={fmtMAD2(r.profitPerDelivered)} />
            <SummaryRow label="Coût / Confirmé (ads)" value={fmtMAD2(r.costPerConfirmedAds)} />
            <SummaryRow label="Coût / Livré (total)" value={fmtMAD2(r.costPerDeliveredTotal)} />
            <SummaryRow label="Budget Ads Break-Even" value={fmtMAD(r.breakEvenAdsBudget)} />
            <SummaryRow label="Budget Ads Restant" value={fmtMAD(r.remainingAdsBudget)} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: string;
}) {
  return (
    <tr className="border-t border-profond/5 first:border-t-0">
      <td className="px-4 py-2 text-profond/60">{label}</td>
      <td className={`px-4 py-2 text-right ${bold ? "font-bold" : ""} ${accent ?? "text-profond"}`}>{value}</td>
    </tr>
  );
}
