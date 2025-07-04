import { useState } from 'react';
import { useFormData } from '@/hooks/useFormData';
import { useNumberInput } from '@/hooks/useNumberInput';
import { useProgress } from '@/hooks/useProgress';
import { useCollapsibleSections } from '@/hooks/useCollapsibleSections';
import { useCurrency } from '@/hooks/useCurrency';
import useAssetCalculation from '@/hooks/useAssetCalculation';
import AssetSimulationHeader from '@/components/asset/AssetSimulationHeader';
import AssetForm from '@/components/asset/AssetForm';
import AssetTargetCard from '@/components/asset/AssetTargetCard';
import AssetScenarioChart from '@/components/asset/AssetScenarioChart';
import AssetAnalysisCharts from '@/components/asset/AssetAnalysisCharts';
import type { SimulationData } from '@/types/asset';

const AssetSimulation = () => {
  const { formData, handleInputChange } = useFormData({
    monthlyIncome: '',
    monthlyExpense: '',
    currentAssets: '',
    targetAmount: '',
    incomeGrowthRate: '3',
    expenseGrowthRate: '2',
    investmentReturn: '5',
    targetHousePrice: '50000',
    customIncomeGrowthRate: '',
    customExpenseGrowthRate: '',
    customInvestmentReturn: '',
  });

  const [simulationData, setSimulationData] = useState<SimulationData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('average');

  // 섹션별 접기/펼치기 상태
  const { expandedSections, toggleSection } = useCollapsibleSections({
    basic: true,
    future: false,
  });

  // 숫자 입력 검증 훅 사용
  const { handleNumberKeyDown, handleNumberPaste } = useNumberInput();

  // 진행률 계산 및 격려 메시지 훅 사용
  const requiredFields = [
    'monthlyIncome',
    'monthlyExpense',
    'currentAssets',
    'targetHousePrice',
    'incomeGrowthRate',
    'expenseGrowthRate',
    'investmentReturn',
  ];

  const { progress, encouragementMessage } = useProgress({
    formData: {
      ...formData,
      // Select 필드는 기본값이 있으므로 항상 채워진 것으로 간주
      incomeGrowthRate: formData.incomeGrowthRate || '3',
      expenseGrowthRate: formData.expenseGrowthRate || '2',
      investmentReturn: formData.investmentReturn || '5',
    },
    requiredFields,
    encouragementMessages: {
      start: {
        message: '미래 자산을 정밀 예측해보세요! 현재 상황을 입력해주세요 💰',
        color: 'text-green-600',
        icon: '📊',
      },
      progress30: {
        message:
          '좋은 시작이에요! 계속 입력해서 15년 후 자산을 확인해보세요 ✨',
        color: 'text-blue-600',
        icon: '📈',
      },
      progress70: {
        message:
          '절반 넘었어요! 미래 전망까지 입력하면 3가지 시나리오로 분석해드려요 💪',
        color: 'text-purple-600',
        icon: '🔮',
      },
      nearComplete: {
        message:
          '거의 완성! 마지막 설정만 입력하면 상세한 차트와 실천법을 확인해요 🔥',
        color: 'text-orange-600',
        icon: '🚀',
      },
      complete: {
        message:
          '완벽해요! 이제 3가지 시나리오와 구체적인 실천법을 확인하세요! 🎉',
        color: 'text-green-600',
        icon: '✅',
      },
    },
  });

  // 통화 포맷팅 훅 사용
  const { formatCurrency } = useCurrency();

  // 자산 계산 로직 훅 사용
  const {
    generateDetailedSimulation,
    getScenarioData,
    getTargetAchievementYear,
    getAssetBreakdown,
  } = useAssetCalculation({ formData });

  const handleGenerateSimulation = () => {
    const data = generateDetailedSimulation();
    setSimulationData(data);
    setShowResults(true);
  };

  const handleGetScenarioData = (scenario: string) => {
    return getScenarioData(scenario, simulationData);
  };

  const handleGetTargetAchievementYear = (scenario: string) => {
    return getTargetAchievementYear(scenario, simulationData);
  };

  const handleGetAssetBreakdown = () => {
    return getAssetBreakdown(simulationData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <AssetSimulationHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <AssetForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleNumberKeyDown={handleNumberKeyDown}
            handleNumberPaste={handleNumberPaste}
            formatCurrency={formatCurrency}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            progress={progress}
            encouragementMessage={encouragementMessage}
            onGenerateSimulation={handleGenerateSimulation}
          />

          {/* Results Overview */}
          {showResults && (
            <AssetTargetCard
              formData={formData}
              formatCurrency={formatCurrency}
              getTargetAchievementYear={handleGetTargetAchievementYear}
            />
          )}
        </div>

        {/* Detailed Results */}
        {showResults && (
          <div className="mt-8 space-y-8">
            {/* Scenario Charts */}
            <AssetScenarioChart
              selectedScenario={selectedScenario}
              onScenarioChange={setSelectedScenario}
              getScenarioData={handleGetScenarioData}
              formatCurrency={formatCurrency}
            />

            {/* 자산 구성 분석 */}
            <AssetAnalysisCharts
              selectedScenario={selectedScenario}
              getScenarioData={handleGetScenarioData}
              getAssetBreakdown={handleGetAssetBreakdown}
              formatCurrency={formatCurrency}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetSimulation;
