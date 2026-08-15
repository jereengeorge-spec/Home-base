import React, { useMemo, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { EconomicsInputs, PricingTier } from '../types';
import {
  buildProfitBridge, buildScaleCurve, calculateEconomics,
  DEFAULT_INPUTS, THIN_MARGIN_SCENARIO,
} from '../services/economicsService';

const money = (value: number, decimals = 0): string => {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const percent = (value: number, decimals = 0): string =>
  Number.isFinite(value) ? `${(value * 100).toFixed(decimals)}%` : '—';

const count = (value: number): string =>
  Number.isFinite(value) ? Math.ceil(value).toLocaleString('en-US') : '—';

interface FieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  hint?: string;
}

const Field: React.FC<FieldProps> = ({ label, value, onChange, prefix, suffix, step = 1, hint }) => (
  <label className="block">
    <span className="text-xs font-medium text-gray-600">{label}</span>
    <div className="mt-1 flex items-center rounded-lg border border-gray-300 bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
      {prefix && <span className="pl-2 text-sm text-gray-400">{prefix}</span>}
      <input
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-transparent px-2 py-1.5 text-sm text-gray-900 focus:outline-none"
      />
      {suffix && <span className="pr-2 text-sm text-gray-400">{suffix}</span>}
    </div>
    {hint && <span className="mt-1 block text-[11px] leading-tight text-gray-400">{hint}</span>}
  </label>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-3">
    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</h4>
    {children}
  </div>
);

interface StatProps {
  label: string;
  value: string;
  sub?: string;
  tone?: 'neutral' | 'good' | 'warn' | 'bad' | 'accent';
}

const toneStyles: Record<NonNullable<StatProps['tone']>, string> = {
  neutral: 'bg-white border-gray-100 text-gray-900',
  good: 'bg-emerald-50 border-emerald-100 text-emerald-900',
  warn: 'bg-amber-50 border-amber-100 text-amber-900',
  bad: 'bg-red-50 border-red-100 text-red-900',
  accent: 'bg-indigo-600 border-indigo-600 text-white',
};

const Stat: React.FC<StatProps> = ({ label, value, sub, tone = 'neutral' }) => (
  <div className={`rounded-2xl border p-5 shadow-sm ${toneStyles[tone]}`}>
    <h4 className={`text-xs font-medium uppercase tracking-wide ${tone === 'accent' ? 'text-indigo-100' : 'opacity-60'}`}>
      {label}
    </h4>
    <p className="mt-1 text-2xl font-bold">{value}</p>
    {sub && <p className={`mt-1 text-xs ${tone === 'accent' ? 'text-indigo-100' : 'opacity-70'}`}>{sub}</p>}
  </div>
);

const chartTooltip = {
  contentStyle: { borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '0.8rem' },
  formatter: (value: number) => money(value),
};

export const PricingModel: React.FC = () => {
  const [inputs, setInputs] = useState<EconomicsInputs>(DEFAULT_INPUTS);

  const set = <K extends keyof EconomicsInputs>(key: K, value: EconomicsInputs[K]) =>
    setInputs(prev => ({ ...prev, [key]: value }));

  const setTier = (index: number, patch: Partial<PricingTier>) =>
    setInputs(prev => ({
      ...prev,
      tiers: prev.tiers.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)),
    }));

  const result = useMemo(() => calculateEconomics(inputs), [inputs]);
  const curve = useMemo(() => buildScaleCurve(inputs), [inputs]);
  const bridge = useMemo(() => buildProfitBridge(inputs, result), [inputs, result]);

  const hitsTarget = result.sdeAnnual >= inputs.targetSde;
  const beatsOperatorWage = result.ownerOperator.pretaxAnnual >= inputs.operatorCostAnnual;
  const absenteeWorks = result.absentee.earningsAnnual > 0;
  const extraCustomers = result.customersForTargetSde - result.customers;
  const priceUplift = result.arpu > 0 ? result.arpuForTargetSde / result.arpu - 1 : Infinity;

  const verdict = beatsOperatorWage
    ? {
        tone: 'good' as const,
        title: 'This clears the owner-operator bar.',
        body: `At ${inputs.ownerHoursPerWeek} hrs/week the business pays you ${money(result.ownerHourlyPretax, 2)}/hr pre-tax, which is more than the ${money(inputs.operatorCostAnnual)} you would have to pay someone else to run it. Working in it is a rational use of your time.`,
      }
    : absenteeWorks
      ? {
          tone: 'warn' as const,
          title: 'Run this one absentee, not owner-operator.',
          body: `Your labour is worth ${money(inputs.operatorCostAnnual)} a year and the business only throws off ${money(result.ownerOperator.pretaxAnnual)} pre-tax — ${money(result.ownerHourlyPretax, 2)}/hr at ${inputs.ownerHoursPerWeek} hrs/week. It still clears ${money(result.absentee.earningsAnnual)} a year after paying an operator, so it works as a hands-off holding. To make it worth your own hours you need ${count(extraCustomers)} more customers or a ${percent(priceUplift)} lift in blended price.`,
        }
      : {
          tone: 'bad' as const,
          title: 'Neither model works at these numbers yet.',
          body: `After paying an operator ${money(inputs.operatorCostAnnual)} the business loses ${money(Math.abs(result.absentee.earningsAnnual))} a year, so it cannot be handed off — and at ${money(result.ownerHourlyPretax, 2)}/hr it is not paying you properly either. Break-even needs ${count(result.breakEvenCustomers)} customers; your ${money(inputs.targetSde)} target needs ${count(result.customersForTargetSde)}.`,
        };

  const verdictStyles = {
    good: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warn: 'bg-amber-50 border-amber-200 text-amber-900',
    bad: 'bg-red-50 border-red-200 text-red-900',
  };

  const comparison = [
    {
      label: 'Owner-operator',
      note: `You work ${inputs.ownerHoursPerWeek} hrs/week`,
      earnings: result.ownerOperator.earningsAnnual,
      earningsLabel: 'SDE',
      takeHome: result.ownerOperator.takeHomeAnnual,
      valuation: result.ownerOperator.valuation,
      multiple: inputs.sdeMultiple,
      accent: 'border-indigo-200 bg-indigo-50/50',
    },
    {
      label: 'Absentee',
      note: `An operator costs ${money(inputs.operatorCostAnnual)}/yr`,
      earnings: result.absentee.earningsAnnual,
      earningsLabel: 'Adjusted EBITDA',
      takeHome: result.absentee.takeHomeAnnual,
      valuation: result.absentee.valuation,
      multiple: inputs.ebitdaMultiple,
      accent: 'border-gray-200 bg-white',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Pricing &amp; Owner Economics</h2>
          <p className="mt-1 max-w-2xl text-gray-500">
            What this product has to charge, and how many customers it has to keep, before the work is
            worth doing yourself — and what it would be worth to sell.
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={() => setInputs(DEFAULT_INPUTS)}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Baseline
          </button>
          <button
            onClick={() => setInputs(THIN_MARGIN_SCENARIO)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Thin-margin $100k
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Inputs */}
        <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-20 lg:self-start">
          <Section title="Pricing tiers">
            <div className="space-y-3">
              {inputs.tiers.map((tier, i) => (
                <div key={tier.name} className="rounded-xl bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{tier.name}</span>
                    <span className="text-xs text-gray-400">{money(tier.price * tier.customers)}/mo</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Price" prefix="$" suffix="/mo" value={tier.price} onChange={v => setTier(i, { price: v })} />
                    <Field label="Customers" value={tier.customers} onChange={v => setTier(i, { customers: v })} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Cost structure">
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="COGS" suffix="%" step={1}
                value={Math.round(inputs.cogsPct * 100)}
                onChange={v => set('cogsPct', v / 100)}
                hint="Hosting, AI inference, fees"
              />
              <Field label="Fixed opex" prefix="$" suffix="/mo" step={100} value={inputs.fixedOpexMonthly} onChange={v => set('fixedOpexMonthly', v)} />
              <Field label="Marketing" prefix="$" suffix="/mo" step={100} value={inputs.marketingMonthly} onChange={v => set('marketingMonthly', v)} />
              <Field label="Add-backs" prefix="$" suffix="/yr" step={500} value={inputs.addBacksAnnual} onChange={v => set('addBacksAnnual', v)} hint="One-off costs, added back" />
              <Field label="Debt service" prefix="$" suffix="/yr" step={500} value={inputs.debtServiceAnnual} onChange={v => set('debtServiceAnnual', v)} />
              <Field label="Tax rate" suffix="%" value={Math.round(inputs.taxRate * 100)} onChange={v => set('taxRate', v / 100)} />
            </div>
          </Section>

          <Section title="Growth &amp; retention">
            <div className="grid grid-cols-2 gap-3">
              <Field label="CAC" prefix="$" step={50} value={inputs.cac} onChange={v => set('cac', v)} />
              <Field
                label="Monthly churn" suffix="%" step={0.5}
                value={Math.round(inputs.monthlyChurnPct * 1000) / 10}
                onChange={v => set('monthlyChurnPct', v / 100)}
              />
            </div>
          </Section>

          <Section title="Your time &amp; exit">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Owner hours" suffix="/wk" value={inputs.ownerHoursPerWeek} onChange={v => set('ownerHoursPerWeek', v)} />
              <Field label="Operator cost" prefix="$" suffix="/yr" step={5000} value={inputs.operatorCostAnnual} onChange={v => set('operatorCostAnnual', v)} hint="To replace yourself" />
              <Field label="SDE multiple" suffix="x" step={0.25} value={inputs.sdeMultiple} onChange={v => set('sdeMultiple', v)} />
              <Field label="EBITDA multiple" suffix="x" step={0.25} value={inputs.ebitdaMultiple} onChange={v => set('ebitdaMultiple', v)} />
              <div className="col-span-2">
                <Field label="Target SDE" prefix="$" suffix="/yr" step={5000} value={inputs.targetSde} onChange={v => set('targetSde', v)} hint="What you want the business to pay you" />
              </div>
            </div>
          </Section>
        </div>

        {/* Results */}
        <div className="space-y-8 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="ARR" value={money(result.arr)} sub={`${money(result.mrr)} MRR`} tone="accent" />
            <Stat label="Gross margin" value={percent(result.grossMarginPct)} sub={`${money(result.grossProfitMonthly)}/mo gross profit`} />
            <Stat label="SDE" value={money(result.sdeAnnual)} sub={`${percent(result.sdeMarginPct)} of revenue`} tone={hitsTarget ? 'good' : 'warn'} />
            <Stat
              label="Your hourly"
              value={`${money(result.ownerHourlyPretax, 2)}/hr`}
              sub={`Pre-tax, at ${inputs.ownerHoursPerWeek} hrs/wk`}
              tone={beatsOperatorWage ? 'good' : 'bad'}
            />
          </div>

          <div className={`rounded-2xl border p-6 ${verdictStyles[verdict.tone]}`}>
            <h3 className="text-lg font-semibold">{verdict.title}</h3>
            <p className="mt-2 text-sm leading-relaxed">{verdict.body}</p>
          </div>

          {/* Ownership models */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {comparison.map(model => (
              <div key={model.label} className={`rounded-2xl border p-6 shadow-sm ${model.accent}`}>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{model.label}</h3>
                  <span className="text-xs text-gray-500">{model.note}</span>
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">{model.earningsLabel}</dt>
                    <dd className="font-semibold text-gray-900">{money(model.earnings)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Take-home after tax &amp; debt</dt>
                    <dd className="font-semibold text-gray-900">{money(model.takeHome)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <dt className="text-gray-500">Sale value at {model.multiple}x</dt>
                    <dd className="text-lg font-bold text-indigo-700">{money(model.valuation)}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          {/* Scale curve */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-gray-900">Earnings vs. customer count</h3>
              <p className="text-sm text-gray-500">
                Break-even at <strong>{count(result.breakEvenCustomers)}</strong> &bull;{' '}
                {money(inputs.targetSde)} target at <strong>{count(result.customersForTargetSde)}</strong> &bull; you have{' '}
                <strong>{count(result.customers)}</strong>
              </p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curve} margin={{ top: 0, right: 10, bottom: 18, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="customers" tick={{ fontSize: 12 }} label={{ value: 'Customers', position: 'insideBottom', offset: -12, fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} width={55} />
                  <Tooltip {...chartTooltip} labelFormatter={(v: number) => `${v} customers`} />
                  <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: '0.8rem' }} />
                  <ReferenceLine y={0} stroke="#9ca3af" />
                  <ReferenceLine
                    y={inputs.targetSde}
                    stroke="#4f46e5"
                    strokeDasharray="4 4"
                    label={{ value: 'Target', position: 'insideTopLeft', fontSize: 11, fill: '#4f46e5' }}
                  />
                  <ReferenceLine
                    x={curve.reduce((closest, p) =>
                      Math.abs(p.customers - result.customers) < Math.abs(closest - result.customers) ? p.customers : closest,
                      curve[0]?.customers ?? 0)}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{ value: 'Today', position: 'top', fontSize: 11, fill: '#10b981' }}
                  />
                  <Line type="monotone" dataKey="sde" name="SDE (owner-operator)" stroke="#4f46e5" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="absentee" name="After paying an operator" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit bridge + unit economics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Revenue to take-home</h3>
              <div className="min-h-[16rem] flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bridge} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} width={55} />
                    <Tooltip {...chartTooltip} />
                    <ReferenceLine y={0} stroke="#9ca3af" />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {bridge.map(bar => <Cell key={bar.name} fill={bar.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Unit economics</h3>
              <dl className="divide-y divide-gray-100 text-sm">
                {[
                  ['Blended ARPU', `${money(result.arpu, 2)}/mo`, null],
                  ['Average customer life', `${result.lifetimeMonths.toFixed(1)} months`, null],
                  ['LTV (gross-margin basis)', money(result.ltv), null],
                  ['LTV : CAC', `${result.ltvToCac.toFixed(1)}x`, result.ltvToCac >= 3 ? 'good' : 'bad'],
                  ['CAC payback', `${result.cacPaybackMonths.toFixed(1)} months`, result.cacPaybackMonths <= 12 ? 'good' : 'bad'],
                  ['New customers / mo', result.newCustomersPerMonth.toFixed(1), null],
                  ['Churned customers / mo', result.churnedCustomersPerMonth.toFixed(1), null],
                  ['Net new / mo', result.netNewCustomersPerMonth.toFixed(1), result.netNewCustomersPerMonth > 0 ? 'good' : 'bad'],
                ].map(([label, value, tone]) => (
                  <div key={label as string} className="flex justify-between py-2.5">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className={`font-semibold ${tone === 'good' ? 'text-emerald-600' : tone === 'bad' ? 'text-red-600' : 'text-gray-900'}`}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-t border-gray-100 pt-3 text-xs leading-relaxed text-gray-400">
                SDE is gross profit less operating and marketing costs, with no owner salary deducted and
                non-recurring costs added back. Absentee earnings deduct a market-rate operator. Take-home is
                after debt service and tax.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
