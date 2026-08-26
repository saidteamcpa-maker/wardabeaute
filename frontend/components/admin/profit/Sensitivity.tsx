"use client";

import { useMemo } from "react";
import { computeProfit, withOverrides, type ProfitInputs, type ProfitResult } from "@/lib/profit";
import { fmtMAD, fmtNum, fmtPctFrac } from "./fields";

const CR_ROWS = [0.3, 0.4, 0.5, 0.6, 0.7];
const DR_COLS = [0.3, 0.4, 0.5, 0.6, 0.7];
const CR_SENS = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8];
const DR_SENS = [0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6];
const CPL_SENS = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

function cellColor(profit: number): string {
  if (profit > 0) return "bg-emerald-50 text-emerald-700";
  if (profit < 0) return "bg-rose-50 text-rose-700";
  return "bg-amber-50 text-amber-700";
}

export function Sensitivity({ inputs }: { inputs: ProfitInputs }) {
  const matrix = useMemo(
    () =>
      CR_ROWS.map((cr) =>
        DR_COLS.map((dr) => {
          const res = computeProfit(withOverrides(inputs, { cr, dr }));
          return { cr, dr, res };
        })
      ),
    [inputs]
  );

  const crSens = useMemo(
    () => CR_SENS.map((cr) => ({ cr, res: computeProfit(withOverrides(inputs, { cr })) })),
    [inputs]
  );
  const drSens = useMemo(
    () => DR_SENS.map((dr) => ({ dr, res: computeProfit(withOverrides(inputs, { dr })) })),
    [inputs]
  );
  const cplSens = useMemo(
    () => CPL_SENS.map((cpl) => ({ cpl, res: computeProfit(withOverrides(inputs, { adsCpl: cpl })) })),
    [inputs]
  );

  const chart = useMemo(() => {
    const base = computeProfit(inputs);
    const maxCpl = Math.max(isNaN(base.breakEvenCpl) ? 60 : base.breakEvenCpl * 1.4, inputs.adsCpl * 1.4, 60);
    const N = 60;
    const pts: { cpl: number; profit: number }[] = [];
    for (let k = 0; k <= N; k++) {
      const cpl = (maxCpl * k) / N;
      pts.push({ cpl, profit: computeProfit(withOverrides(inputs, { adsCpl: cpl })).netProfit });
    }
    const minP = Math.min(0, ...pts.map((p) => p.profit));
    const maxP = Math.max(0, ...pts.map((p) => p.profit));
    return { pts, maxCpl, minP, maxP };
  }, [inputs]);

  const W = 720;
  const H = 300;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const x = (cpl: number) => padL + (cpl / chart.maxCpl) * (W - padL - padR);
  const y = (p: number) => H - padB - ((p - chart.minP) / (chart.maxP - chart.minP || 1)) * (H - padT - padB);
  const path = chart.pts.map((pt) => `${x(pt.cpl).toFixed(1)},${y(pt.profit).toFixed(1)}`).join(" ");
  const zeroY = y(0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-profond">Matrice de sensibilité CR × DR</h3>
        <p className="mt-1 text-xs text-profond/50">
          Chaque cellule = profit net pour ce couple (CR lignes, DR colonnes). Vert = rentable, rouge = déficit.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left text-profond/50">CR ↓ \ DR →</th>
                {DR_COLS.map((d) => (
                  <th key={d} className="p-2 text-right text-profond/50">{fmtPctFrac(d)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <td className="p-2 font-semibold text-profond/60">{fmtPctFrac(CR_ROWS[i])}</td>
                  {row.map((cell) => (
                    <td
                      key={cell.dr}
                      title={`Livrés: ${fmtNum(cell.res.delivered)} | Ventes: ${fmtMAD(cell.res.totalSales)} | Coûts: ${fmtMAD(cell.res.totalCharges)} | Marge: ${isNaN(cell.res.profitMargin) ? "—" : fmtPctFrac(cell.res.profitMargin)}`}
                      className={`p-2 text-right tabular-nums ${cellColor(cell.res.netProfit)}`}
                    >
                      <div className="font-semibold">{fmtMAD(cell.res.netProfit)}</div>
                      <div className="text-[10px] opacity-70">{fmtNum(cell.res.delivered)} livrés</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SensTable title="Sensibilité CR" rows={crSens} label={(v) => fmtPctFrac(v.cr)} />
        <SensTable title="Sensibilité DR" rows={drSens} label={(v) => fmtPctFrac(v.dr)} />
        <SensTable title="Sensibilité CPL" rows={cplSens} label={(v) => fmtMAD(v.cpl)} highlight={(v) => isNaN(inputs.adsCpl) ? false : v.cpl === inputs.adsCpl} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-profond">Graphique break-even : CPL vs Profit Net</h3>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full rounded-2xl border border-profond/10 bg-white">
          <line x1={padL} y1={zeroY} x2={W - padR} y2={zeroY} stroke="#cbd5e1" strokeDasharray="4 4" />
          <text x={padL - 6} y={zeroY + 4} textAnchor="end" className="fill-profond/40" fontSize="10">0</text>
          <polyline points={path} fill="none" stroke="#b07a55" strokeWidth="2" />
          <line x1={x(inputs.adsCpl)} y1={padT} x2={x(inputs.adsCpl)} y2={H - padB} stroke="#0ea5e9" strokeWidth="1.5" />
          <text x={x(inputs.adsCpl)} y={padT - 6} textAnchor="middle" className="fill-sky-600" fontSize="10">CPL actuel</text>
          {!isNaN(computeProfit(inputs).breakEvenCpl) && (
            <>
              <line x1={x(computeProfit(inputs).breakEvenCpl)} y1={padT} x2={x(computeProfit(inputs).breakEvenCpl)} y2={H - padB} stroke="#ef4444" strokeWidth="1.5" />
              <text x={x(computeProfit(inputs).breakEvenCpl)} y={padT - 6} textAnchor="middle" className="fill-rose-600" fontSize="10">BE CPL</text>
            </>
          )}
          <text x={padL} y={H - 12} className="fill-profond/40" fontSize="10">CPL = 0</text>
          <text x={W - padR} y={H - 12} textAnchor="end" className="fill-profond/40" fontSize="10">{fmtMAD(chart.maxCpl)}</text>
        </svg>
      </div>
    </div>
  );
}

function SensTable({
  title,
  rows,
  label,
  highlight,
}: {
  title: string;
  rows: any[];
  label: (v: any) => string;
  highlight?: (v: any) => boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-profond/10 bg-white">
      <div className="border-b border-profond/10 px-4 py-2 text-xs font-semibold text-profond">{title}</div>
      <table className="w-full text-xs">
        <tbody>
          {rows.map((v, i) => {
            const res: ProfitResult = v.res;
            return (
              <tr key={i} className={`border-t border-profond/5 ${highlight?.(v) ? "bg-sky-50" : ""}`}>
                <td className="px-4 py-1.5 text-profond/60">{label(v)}</td>
                <td className={`px-4 py-1.5 text-right tabular-nums ${res.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {fmtMAD(res.netProfit)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
