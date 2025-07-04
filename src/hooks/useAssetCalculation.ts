import { useMemo } from 'react';
import { scenarios } from '@/mocks/assetData';
import type { SimulationData, ScenarioData } from '@/types/asset';

interface FormData {
  monthlyIncome: string;
  monthlyExpense: string;
  currentAssets: string;
  targetHousePrice: string;
  incomeGrowthRate: string;
  expenseGrowthRate: string;
  investmentReturn: string;
  customIncomeGrowthRate: string;
  customExpenseGrowthRate: string;
  customInvestmentReturn: string;
}

interface UseAssetCalculationProps {
  formData: FormData;
}

const useAssetCalculation = ({ formData }: UseAssetCalculationProps) => {
  const generateDetailedSimulation = useMemo(() => {
    return () => {
      const income = parseInt(formData.monthlyIncome) || 0;
      const expense = parseInt(formData.monthlyExpense) || 0;
      const currentAssets = parseInt(formData.currentAssets) || 0;
      const targetHousePrice = parseInt(formData.targetHousePrice) || 50000;

      const userIncomeGrowthRate =
        formData.incomeGrowthRate === 'custom'
          ? parseFloat(formData.customIncomeGrowthRate) || 3
          : parseFloat(formData.incomeGrowthRate) || 3;

      const userExpenseGrowthRate =
        formData.expenseGrowthRate === 'custom'
          ? parseFloat(formData.customExpenseGrowthRate) || 2
          : parseFloat(formData.expenseGrowthRate) || 2;

      const userInvestmentReturn =
        formData.investmentReturn === 'custom'
          ? parseFloat(formData.customInvestmentReturn) || 5
          : parseFloat(formData.investmentReturn) || 5;

      const data: SimulationData[] = [];

      for (let year = 0; year <= 15; year++) {
        const scenarios_data: Record<string, ScenarioData> = {};

        Object.entries(scenarios).forEach(([key, scenario]) => {
          let yearlyIncomeGrowth = userIncomeGrowthRate / 100;
          let yearlyExpenseGrowth = userExpenseGrowthRate / 100;
          let yearlyReturn = userInvestmentReturn / 100;

          if (key === 'worst') {
            yearlyIncomeGrowth = Math.max(0, yearlyIncomeGrowth - 0.02);
            yearlyExpenseGrowth = yearlyExpenseGrowth + 0.015;
            yearlyReturn = Math.max(0.01, yearlyReturn - 0.03);
          } else if (key === 'best') {
            yearlyIncomeGrowth = yearlyIncomeGrowth + 0.02;
            yearlyExpenseGrowth = Math.max(0.005, yearlyExpenseGrowth - 0.005);
            yearlyReturn = yearlyReturn + 0.03;
          }

          const currentIncome = income * Math.pow(1 + yearlyIncomeGrowth, year);
          const currentExpense =
            expense * Math.pow(1 + yearlyExpenseGrowth, year);
          const monthlySavings = currentIncome - currentExpense;

          let totalAssets = currentAssets * 10000;

          if (year > 0) {
            totalAssets =
              currentAssets * 10000 * Math.pow(1 + yearlyReturn, year);

            for (let i = 1; i <= year; i++) {
              const yearIncome = income * Math.pow(1 + yearlyIncomeGrowth, i);
              const yearExpense =
                expense * Math.pow(1 + yearlyExpenseGrowth, i);
              const yearSavings = (yearIncome - yearExpense) * 12 * 10000;

              if (yearSavings > 0) {
                totalAssets +=
                  yearSavings * Math.pow(1 + yearlyReturn, year - i);
              }
            }
          }

          scenarios_data[key] = {
            assets: Math.round(totalAssets / 10000),
            income: Math.round(currentIncome),
            expense: Math.round(currentExpense),
            savings: Math.round(monthlySavings),
            canBuy: totalAssets >= targetHousePrice * 10000,
          };
        });

        data.push({
          year: year === 0 ? '현재' : `${year}년`,
          assets: scenarios_data.average.assets,
          savings: scenarios_data.average.savings,
          totalIncome: scenarios_data.average.income * 12,
          totalExpense: scenarios_data.average.expense * 12,
          netWorth: scenarios_data.average.assets,
          canBuyWorst: scenarios_data.worst.canBuy,
          canBuyAverage: scenarios_data.average.canBuy,
          canBuyBest: scenarios_data.best.canBuy,
        });
      }

      return data;
    };
  }, [formData]);

  const getScenarioData = useMemo(() => {
    return (scenario: string, simulationData: SimulationData[]) => {
      const income = parseInt(formData.monthlyIncome) || 0;
      const expense = parseInt(formData.monthlyExpense) || 0;
      const currentAssets = parseInt(formData.currentAssets) || 0;

      const userIncomeGrowthRate =
        formData.incomeGrowthRate === 'custom'
          ? parseFloat(formData.customIncomeGrowthRate) || 3
          : parseFloat(formData.incomeGrowthRate) || 3;

      const userExpenseGrowthRate =
        formData.expenseGrowthRate === 'custom'
          ? parseFloat(formData.customExpenseGrowthRate) || 2
          : parseFloat(formData.expenseGrowthRate) || 2;

      const userInvestmentReturn =
        formData.investmentReturn === 'custom'
          ? parseFloat(formData.customInvestmentReturn) || 5
          : parseFloat(formData.investmentReturn) || 5;

      return simulationData.map((item, index) => {
        const year = index;

        let yearlyIncomeGrowth = userIncomeGrowthRate / 100;
        let yearlyExpenseGrowth = userExpenseGrowthRate / 100;
        let yearlyReturn = userInvestmentReturn / 100;

        if (scenario === 'worst') {
          yearlyIncomeGrowth = Math.max(0, yearlyIncomeGrowth - 0.02);
          yearlyExpenseGrowth = yearlyExpenseGrowth + 0.015;
          yearlyReturn = Math.max(0.01, yearlyReturn - 0.03);
        } else if (scenario === 'best') {
          yearlyIncomeGrowth = yearlyIncomeGrowth + 0.02;
          yearlyExpenseGrowth = Math.max(0.005, yearlyExpenseGrowth - 0.005);
          yearlyReturn = yearlyReturn + 0.03;
        }

        const currentIncome = income * Math.pow(1 + yearlyIncomeGrowth, year);
        const currentExpense =
          expense * Math.pow(1 + yearlyExpenseGrowth, year);

        let totalAssets = currentAssets * 10000;

        if (year > 0) {
          totalAssets =
            currentAssets * 10000 * Math.pow(1 + yearlyReturn, year);

          for (let i = 1; i <= year; i++) {
            const yearIncome = income * Math.pow(1 + yearlyIncomeGrowth, i);
            const yearExpense = expense * Math.pow(1 + yearlyExpenseGrowth, i);
            const yearSavings = (yearIncome - yearExpense) * 12 * 10000;

            if (yearSavings > 0) {
              totalAssets += yearSavings * Math.pow(1 + yearlyReturn, year - i);
            }
          }
        }

        return {
          ...item,
          assets: Math.round(totalAssets / 10000),
          income: Math.round(currentIncome),
          expense: Math.round(currentExpense),
          savings: Math.round(currentIncome - currentExpense),
        };
      });
    };
  }, [formData]);

  const getTargetAchievementYear = useMemo(() => {
    return (scenario: string, simulationData: SimulationData[]) => {
      const targetPrice = parseInt(formData.targetHousePrice) || 50000;
      const data = getScenarioData(scenario, simulationData);
      const achievementYear = data.findIndex(
        (item) => item.assets >= targetPrice
      );
      return achievementYear === -1 ? null : achievementYear;
    };
  }, [formData, getScenarioData]);

  const getAssetBreakdown = useMemo(() => {
    return (simulationData: SimulationData[]) => {
      if (simulationData.length === 0) return [];

      const currentSavings =
        simulationData[simulationData.length - 1]?.savings || 0;
      const currentAssets = parseInt(formData.currentAssets) || 0;
      const investmentGains =
        simulationData[simulationData.length - 1]?.assets -
        currentAssets -
        currentSavings * 15 * 12;

      return [
        { name: '기존 자산', value: currentAssets, fill: '#3b82f6' },
        { name: '저축 누적', value: currentSavings * 15 * 12, fill: '#10b981' },
        {
          name: '투자 수익',
          value: Math.max(0, investmentGains),
          fill: '#f59e0b',
        },
      ];
    };
  }, [formData]);

  return {
    generateDetailedSimulation,
    getScenarioData,
    getTargetAchievementYear,
    getAssetBreakdown,
  };
};

export default useAssetCalculation;
