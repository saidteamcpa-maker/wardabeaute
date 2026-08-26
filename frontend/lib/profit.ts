export interface ProfitInputs {
  leads: number;
  adsCpl: number;
  cr: number; // 0..1
  dr: number; // 0..1
  sellingPrice: number;
  productCost: number;
  serviceFee: number;
  leadFee: number;
  otherVariableCost: number; // per delivered order
  otherFixedCosts: number;
}

export const DEFAULT_INPUTS: ProfitInputs = {
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

export interface ProfitResult {
  leads: number;
  cr: number;
  dr: number;
  confirmed: number;
  delivered: number;
  adsCost: number;
  productCostTotal: number;
  serviceFees: number;
  leadFees: number;
  otherVariableTotal: number;
  totalCharges: number;
  totalSales: number;
  netProfit: number;
  profitMargin: number; // NaN if no sales
  profitPerLead: number;
  profitPerConfirmed: number;
  profitPerDelivered: number;
  costPerConfirmedAds: number;
  costPerConfirmedTotal: number;
  costPerDeliveredAds: number;
  costPerDeliveredTotal: number;
  contribution: number; // per delivered margin
  impossible: boolean;
  breakEvenCpl: number; // NaN if impossible
  breakEvenCr: number; // fraction, NaN if impossible
  breakEvenDr: number; // fraction, NaN if impossible
  breakEvenAdsBudget: number;
  remainingAdsBudget: number;
  cplSafety: number;
  crSafety: number; // fraction points
  drSafety: number; // fraction points
  cplStatus: "profit" | "even" | "loss" | "impossible";
  crStatus: "profit" | "even" | "loss" | "impossible";
  drStatus: "profit" | "even" | "loss" | "impossible";
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const safeDiv = (a: number, b: number) => (b === 0 ? NaN : a / b);

export function computeProfit(i: ProfitInputs): ProfitResult {
  const leads = Math.max(0, i.leads);
  const cr = clamp01(i.cr);
  const dr = clamp01(i.dr);

  const confirmed = leads * cr;
  const delivered = confirmed * dr;

  const adsCost = leads * i.adsCpl;
  const productCostTotal = delivered * i.productCost;
  const serviceFees = delivered * i.serviceFee;
  const leadFees = leads * i.leadFee;
  const otherVariableTotal = delivered * i.otherVariableCost;

  const totalCharges =
    adsCost +
    productCostTotal +
    serviceFees +
    leadFees +
    otherVariableTotal +
    i.otherFixedCosts;

  const totalSales = delivered * i.sellingPrice;
  const netProfit = totalSales - totalCharges;
  const profitMargin = totalSales > 0 ? netProfit / totalSales : NaN;

  const profitPerLead = safeDiv(netProfit, leads);
  const profitPerConfirmed = safeDiv(netProfit, confirmed);
  const profitPerDelivered = safeDiv(netProfit, delivered);

  const costPerConfirmedAds = safeDiv(i.adsCpl, cr);
  const costPerConfirmedTotal = safeDiv(totalCharges, confirmed);
  const costPerDeliveredAds = safeDiv(i.adsCpl, cr * dr);
  const costPerDeliveredTotal = safeDiv(totalCharges, delivered);

  const contribution = i.sellingPrice - i.productCost - i.serviceFee - i.otherVariableCost;
  const impossible = contribution <= 0;

  const breakEvenCpl = impossible ? NaN : cr * dr * contribution - i.leadFee;
  const breakEvenCr = impossible ? NaN : safeDiv(i.adsCpl + i.leadFee, dr * contribution);
  const breakEvenDr = impossible ? NaN : safeDiv(i.adsCpl + i.leadFee, cr * contribution);

  const breakEvenAdsBudget = isNaN(breakEvenCpl) ? NaN : leads * breakEvenCpl;
  const remainingAdsBudget = isNaN(breakEvenAdsBudget) ? NaN : breakEvenAdsBudget - adsCost;

  const cplSafety = isNaN(breakEvenCpl) ? NaN : breakEvenCpl - i.adsCpl;
  const crSafety = isNaN(breakEvenCr) ? NaN : cr - breakEvenCr;
  const drSafety = isNaN(breakEvenDr) ? NaN : dr - breakEvenDr;

  const cplStatus: ProfitResult["cplStatus"] = impossible
    ? "impossible"
    : i.adsCpl < breakEvenCpl
      ? "profit"
      : i.adsCpl > breakEvenCpl
        ? "loss"
        : "even";
  const crStatus: ProfitResult["crStatus"] = impossible
    ? "impossible"
    : cr > breakEvenCr!
      ? "profit"
      : cr < breakEvenCr!
        ? "loss"
        : "even";
  const drStatus: ProfitResult["drStatus"] = impossible
    ? "impossible"
    : dr > breakEvenDr!
      ? "profit"
      : dr < breakEvenDr!
        ? "loss"
        : "even";

  return {
    leads,
    cr,
    dr,
    confirmed,
    delivered,
    adsCost,
    productCostTotal,
    serviceFees,
    leadFees,
    otherVariableTotal,
    totalCharges,
    totalSales,
    netProfit,
    profitMargin,
    profitPerLead,
    profitPerConfirmed,
    profitPerDelivered,
    costPerConfirmedAds,
    costPerConfirmedTotal,
    costPerDeliveredAds,
    costPerDeliveredTotal,
    contribution,
    impossible,
    breakEvenCpl,
    breakEvenCr,
    breakEvenDr,
    breakEvenAdsBudget,
    remainingAdsBudget,
    cplSafety,
    crSafety,
    drSafety,
    cplStatus,
    crStatus,
    drStatus,
  };
}

export type Status = ProfitResult["cplStatus"];

export function withOverrides(base: ProfitInputs, overrides: Partial<ProfitInputs>): ProfitInputs {
  return { ...base, ...overrides };
}
