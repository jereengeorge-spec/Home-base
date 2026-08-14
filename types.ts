
export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum Urgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Ticket {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  description: string;
  urgency: Urgency;
  status: TicketStatus;
  category: string;
  createdAt: string;
  aiSummary?: string;
  aiSuggestedFix?: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

export interface PricingTier {
  name: string;
  price: number;      // monthly price per customer
  customers: number;
}

export interface EconomicsInputs {
  tiers: PricingTier[];
  cogsPct: number;              // hosting, AI inference, payment fees, as a share of revenue
  fixedOpexMonthly: number;     // software, accounting, insurance
  marketingMonthly: number;
  addBacksAnnual: number;       // one-off / non-recurring costs added back for SDE
  debtServiceAnnual: number;    // interest + principal on any acquisition or startup debt
  taxRate: number;
  cac: number;                  // fully loaded cost to acquire one customer
  monthlyChurnPct: number;      // logo churn
  ownerHoursPerWeek: number;
  operatorCostAnnual: number;   // cost of hiring someone to do the owner's job
  sdeMultiple: number;          // multiple applied to SDE in an owner-operator sale
  ebitdaMultiple: number;       // multiple applied to post-operator earnings in an absentee sale
  targetSde: number;            // the owner's income goal
}

export interface OwnershipOutcome {
  earningsAnnual: number;   // SDE for owner-operator, post-operator EBITDA for absentee
  pretaxAnnual: number;     // after debt service
  takeHomeAnnual: number;   // after tax
  valuation: number;
}

export interface EconomicsResult {
  customers: number;
  arpu: number;
  mrr: number;
  arr: number;
  cogsMonthly: number;
  grossProfitMonthly: number;
  grossMarginPct: number;
  sdeAnnual: number;
  sdeMarginPct: number;
  ownerOperator: OwnershipOutcome;
  absentee: OwnershipOutcome;
  ownerHourlyPretax: number;
  lifetimeMonths: number;
  ltv: number;
  ltvToCac: number;
  cacPaybackMonths: number;
  newCustomersPerMonth: number;
  churnedCustomersPerMonth: number;
  netNewCustomersPerMonth: number;
  customersForTargetSde: number;
  arpuForTargetSde: number;
  breakEvenCustomers: number;
}
