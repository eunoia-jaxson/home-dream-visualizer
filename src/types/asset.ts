export interface ScenarioConfig {
  incomeGrowthRate: number;
  expenseGrowthRate: number;
  investmentReturn: number;
  inflationRate: number;
  name: string;
  color: string;
}

export interface SimulationData {
  year: string;
  assets: number;
  savings: number;
  totalIncome: number;
  totalExpense: number;
  netWorth: number;
  canBuyWorst: boolean;
  canBuyAverage: boolean;
  canBuyBest: boolean;
}

export interface ScenarioData {
  assets: number;
  income: number;
  expense: number;
  savings: number;
  canBuy: boolean;
}
