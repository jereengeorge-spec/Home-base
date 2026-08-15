import { EconomicsInputs, EconomicsResult, OwnershipOutcome, PricingTier } from '../types';

/**
 * Pure financial model behind the Pricing & Owner Economics view.
 *
 * The vocabulary follows how small-business buyers and brokers actually talk:
 *
 *   Gross profit  = revenue - COGS (hosting, AI inference, payment fees)
 *   SDE           = gross profit - operating expenses - marketing + non-recurring add-backs,
 *                   with no owner salary deducted. It is the whole financial benefit the
 *                   business throws off to one working owner.
 *   Absentee EBITDA = SDE - the cost of hiring someone to do the owner's job.
 *   Net profit / take-home = earnings after debt service and tax.
 *
 * Everything is derived, nothing is stored, so the UI can recompute on every keystroke.
 */

const MAX_LIFETIME_MONTHS = 120; // cap a zero-churn assumption at 10 years

export const DEFAULT_INPUTS: EconomicsInputs = {
  tiers: [
    { name: 'Starter', price: 49, customers: 60 },
    { name: 'Growth', price: 149, customers: 30 },
    { name: 'Scale', price: 399, customers: 6 },
  ],
  cogsPct: 0.22,
  fixedOpexMonthly: 1400,
  marketingMonthly: 2500,
  addBacksAnnual: 0,
  debtServiceAnnual: 0,
  taxRate: 0.25,
  cac: 900,
  monthlyChurnPct: 0.025,
  ownerHoursPerWeek: 40,
  operatorCostAnnual: 55000,
  sdeMultiple: 3,
  ebitdaMultiple: 4,
  targetSde: 120000,
};

/**
 * The situation that started this whole model: ~$100k of revenue that only leaves
 * the owner about $15k after everything, which is fine for an absentee holding and
 * miserable for someone working 40 hours a week.
 */
export const THIN_MARGIN_SCENARIO: EconomicsInputs = {
  ...DEFAULT_INPUTS,
  tiers: [
    { name: 'Starter', price: 39, customers: 120 },
    { name: 'Growth', price: 99, customers: 45 },
    { name: 'Scale', price: 249, customers: 3 },
  ],
  cogsPct: 0.3,
  fixedOpexMonthly: 1800,
  marketingMonthly: 3600,
  targetSde: 100000,
};

export const roundTo = (value: number, decimals = 0): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const safeDivide = (numerator: number, denominator: number): number =>
  denominator === 0 ? 0 : numerator / denominator;

export const totalCustomers = (tiers: PricingTier[]): number =>
  tiers.reduce((sum, tier) => sum + Math.max(0, tier.customers), 0);

export const monthlyRevenue = (tiers: PricingTier[]): number =>
  tiers.reduce((sum, tier) => sum + Math.max(0, tier.price) * Math.max(0, tier.customers), 0);

/** Annual SDE for an arbitrary customer count, holding price mix and cost structure fixed. */
export const sdeAtCustomerCount = (inputs: EconomicsInputs, customers: number): number => {
  const arpu = safeDivide(monthlyRevenue(inputs.tiers), totalCustomers(inputs.tiers));
  const contributionPerCustomer = arpu * (1 - inputs.cogsPct);
  const monthly = customers * contributionPerCustomer - inputs.fixedOpexMonthly - inputs.marketingMonthly;
  return monthly * 12 + inputs.addBacksAnnual;
};

/** Customers required to reach a given annual SDE at today's prices and cost base. */
export const customersForSde = (inputs: EconomicsInputs, targetSde: number): number => {
  const arpu = safeDivide(monthlyRevenue(inputs.tiers), totalCustomers(inputs.tiers));
  const contributionPerCustomer = arpu * (1 - inputs.cogsPct);
  if (contributionPerCustomer <= 0) return Infinity;
  const requiredMonthlyProfit = (targetSde - inputs.addBacksAnnual) / 12;
  return (requiredMonthlyProfit + inputs.fixedOpexMonthly + inputs.marketingMonthly) / contributionPerCustomer;
};

/** Blended ARPU required to reach a given annual SDE without adding a single customer. */
export const arpuForSde = (inputs: EconomicsInputs, targetSde: number): number => {
  const customers = totalCustomers(inputs.tiers);
  if (customers === 0 || inputs.cogsPct >= 1) return Infinity;
  const requiredMonthlyProfit = (targetSde - inputs.addBacksAnnual) / 12;
  return (requiredMonthlyProfit + inputs.fixedOpexMonthly + inputs.marketingMonthly) /
    (customers * (1 - inputs.cogsPct));
};

const buildOutcome = (
  earningsAnnual: number,
  debtServiceAnnual: number,
  taxRate: number,
  multiple: number,
): OwnershipOutcome => {
  const pretaxAnnual = earningsAnnual - debtServiceAnnual;
  const tax = pretaxAnnual > 0 ? pretaxAnnual * taxRate : 0;
  return {
    earningsAnnual,
    pretaxAnnual,
    takeHomeAnnual: pretaxAnnual - tax,
    valuation: Math.max(0, earningsAnnual) * multiple,
  };
};

export const calculateEconomics = (inputs: EconomicsInputs): EconomicsResult => {
  const customers = totalCustomers(inputs.tiers);
  const mrr = monthlyRevenue(inputs.tiers);
  const arpu = safeDivide(mrr, customers);

  const cogsMonthly = mrr * inputs.cogsPct;
  const grossProfitMonthly = mrr - cogsMonthly;
  const grossMarginPct = safeDivide(grossProfitMonthly, mrr);

  const sdeAnnual = sdeAtCustomerCount(inputs, customers);
  const absenteeEarnings = sdeAnnual - inputs.operatorCostAnnual;

  const ownerOperator = buildOutcome(sdeAnnual, inputs.debtServiceAnnual, inputs.taxRate, inputs.sdeMultiple);
  const absentee = buildOutcome(absenteeEarnings, inputs.debtServiceAnnual, inputs.taxRate, inputs.ebitdaMultiple);

  const lifetimeMonths = inputs.monthlyChurnPct > 0
    ? Math.min(1 / inputs.monthlyChurnPct, MAX_LIFETIME_MONTHS)
    : MAX_LIFETIME_MONTHS;
  const contributionPerCustomer = arpu * grossMarginPct;

  return {
    customers,
    arpu,
    mrr,
    arr: mrr * 12,
    cogsMonthly,
    grossProfitMonthly,
    grossMarginPct,
    sdeAnnual,
    sdeMarginPct: safeDivide(sdeAnnual, mrr * 12),
    ownerOperator,
    absentee,
    ownerHourlyPretax: safeDivide(ownerOperator.pretaxAnnual, inputs.ownerHoursPerWeek * 52),
    lifetimeMonths,
    ltv: contributionPerCustomer * lifetimeMonths,
    ltvToCac: safeDivide(contributionPerCustomer * lifetimeMonths, inputs.cac),
    cacPaybackMonths: safeDivide(inputs.cac, contributionPerCustomer),
    newCustomersPerMonth: safeDivide(inputs.marketingMonthly, inputs.cac),
    churnedCustomersPerMonth: customers * inputs.monthlyChurnPct,
    netNewCustomersPerMonth: safeDivide(inputs.marketingMonthly, inputs.cac) - customers * inputs.monthlyChurnPct,
    customersForTargetSde: customersForSde(inputs, inputs.targetSde),
    arpuForTargetSde: arpuForSde(inputs, inputs.targetSde),
    breakEvenCustomers: customersForSde(inputs, 0),
  };
};

export interface ScaleCurvePoint {
  customers: number;
  sde: number;
  absentee: number;
  arr: number;
}

/** Sweeps customer count so the chart can show where the target and break-even land. */
export const buildScaleCurve = (inputs: EconomicsInputs, points = 25): ScaleCurvePoint[] => {
  const current = totalCustomers(inputs.tiers);
  const needed = customersForSde(inputs, inputs.targetSde);
  const upper = Math.max(current * 2, Number.isFinite(needed) ? needed * 1.25 : 0, 20);
  const step = upper / (points - 1);
  const arpu = safeDivide(monthlyRevenue(inputs.tiers), current);

  return Array.from({ length: points }, (_, i) => {
    const customers = Math.round(i * step);
    const sde = sdeAtCustomerCount(inputs, customers);
    return {
      customers,
      sde: roundTo(sde),
      absentee: roundTo(sde - inputs.operatorCostAnnual),
      arr: roundTo(customers * arpu * 12),
    };
  });
};

export interface ProfitBridgeBar {
  name: string;
  value: number;
  fill: string;
}

/** Annualised walk from revenue down to what the owner actually keeps. */
export const buildProfitBridge = (inputs: EconomicsInputs, result: EconomicsResult): ProfitBridgeBar[] => [
  { name: 'Revenue', value: roundTo(result.arr), fill: '#4f46e5' },
  { name: 'COGS', value: -roundTo(result.cogsMonthly * 12), fill: '#f59e0b' },
  { name: 'Opex', value: -roundTo(inputs.fixedOpexMonthly * 12), fill: '#fb923c' },
  { name: 'Marketing', value: -roundTo(inputs.marketingMonthly * 12), fill: '#f472b6' },
  { name: 'SDE', value: roundTo(result.sdeAnnual), fill: '#10b981' },
  { name: 'Take-home', value: roundTo(result.ownerOperator.takeHomeAnnual), fill: '#059669' },
];
