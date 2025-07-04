export interface LoanProduct {
  id: string;
  name: string;
  type: string;
  category: 'government' | 'bank' | 'policy';
  maxLTV: number;
  maxDTI: number;
  maxDSR: number;
  baseRate: number;
  additionalRate: number;
  finalRate: number;
  maxAmount: number;
  minAmount: number;
  maxTerm: number;
  eligible: boolean;
  eligibilityReason?: string;
  monthlyPayment: number;
  totalInterest: number;
  guaranteeFee: number;
  conditions: string[];
  benefits: string[];
  restrictions: string[];
}

export interface SimulationData {
  loanAmount: number;
  term: number;
  rateType: 'fixed' | 'variable' | 'mixed';
  repaymentType: 'equal_payment' | 'equal_principal' | 'bullet';
  scenario: 'best' | 'normal' | 'worst';
  monthlyPayments: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    rate: number;
  }>;
  summary: {
    totalPayment: number;
    totalInterest: number;
    averageRate: number;
    maxPayment: number;
    minPayment: number;
  };
}
