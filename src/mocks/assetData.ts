import type { ScenarioConfig } from '@/types/asset';

// 시나리오 설정
export const scenarios: Record<string, ScenarioConfig> = {
  worst: {
    incomeGrowthRate: 1,
    expenseGrowthRate: 4,
    investmentReturn: 2,
    inflationRate: 4,
    name: '최악의 시나리오',
    color: '#ef4444',
  },
  average: {
    incomeGrowthRate: 3,
    expenseGrowthRate: 2.5,
    investmentReturn: 5,
    inflationRate: 2.5,
    name: '평균 시나리오',
    color: '#3b82f6',
  },
  best: {
    incomeGrowthRate: 5,
    expenseGrowthRate: 1.5,
    investmentReturn: 8,
    inflationRate: 2,
    name: '최선의 시나리오',
    color: '#10b981',
  },
};
 