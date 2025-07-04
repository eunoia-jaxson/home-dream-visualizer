import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PiggyBank } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useFormData } from '@/hooks/useFormData';
import { useNumberInput } from '@/hooks/useNumberInput';
import { useProgress } from '@/hooks/useProgress';
import { useCollapsibleSections } from '@/hooks/useCollapsibleSections';
import { useCurrency } from '@/hooks/useCurrency';
import { useLoanCalculation } from '@/hooks/useLoanCalculation';
import type { LoanProduct } from '@/types/loan';

// 컴포넌트들 import
import LoanSimulationHeader from '@/components/loan/LoanSimulationHeader';
import ProgressBar from '@/components/loan/ProgressBar';
import BasicInfoSection from '@/components/loan/BasicInfoSection';
import PersonalInfoSection from '@/components/loan/PersonalInfoSection';
import SimulationSettingsSection from '@/components/loan/SimulationSettingsSection';
import LoanResultsCard from '@/components/loan/LoanResultsCard';
import LoanDetailCard from '@/components/loan/LoanDetailCard';
import InfoCards from '@/components/loan/InfoCards';

const LoanSimulation = () => {
  const { formData, handleInputChange } = useFormData({
    housePrice: '',
    monthlyIncome: '',
    existingLoan: '',
    marriageStatus: 'single',
    age: '',
    region: '서울',
    houseType: 'apartment',
    jobType: 'employee',
    workExperience: '',
    firstHome: 'yes',
    children: '0',
    deposit: '',
    loanPurpose: 'purchase',
  });

  const [simulationSettings, setSimulationSettings] = useState({
    term: '30',
    rateType: 'variable' as 'fixed' | 'variable' | 'mixed',
    repaymentType: 'equal_payment' as
      | 'equal_payment'
      | 'equal_principal'
      | 'bullet',
  });

  const [loanResults, setLoanResults] = useState<LoanProduct[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanProduct | null>(null);

  // 섹션별 접기/펼치기 상태
  const { expandedSections, toggleSection } = useCollapsibleSections({
    basic: true,
    personal: false,
    financial: false,
  });

  const handleSimulationChange = (field: string, value: string) => {
    setSimulationSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 숫자 입력 검증 훅 사용
  const { handleNumberKeyDown, handleNumberPaste } = useNumberInput();

  // 진행률 계산 및 격려 메시지 훅 사용
  const requiredFields = [
    'housePrice',
    'monthlyIncome',
    'marriageStatus',
    'age',
    'region',
    'houseType',
    'jobType',
    'workExperience',
    'firstHome',
    'children',
    'deposit',
  ];

  const { progress, encouragementMessage } = useProgress({
    formData,
    requiredFields,
    encouragementMessages: {
      start: {
        message: '내 집 마련의 첫걸음! 기본 정보를 입력해보세요 🏡',
        color: 'text-blue-600',
        icon: '🎯',
      },
      progress30: {
        message: '좋은 시작이에요! 계속 입력해서 최적의 대출을 찾아보세요 ✨',
        color: 'text-green-600',
        icon: '📝',
      },
      progress70: {
        message:
          '절반 넘었어요! 조금만 더 입력하면 맞춤 대출 상품을 확인할 수 있어요 💪',
        color: 'text-blue-600',
        icon: '💰',
      },
      nearComplete: {
        message:
          '거의 완성! 마지막 정보만 입력하면 최저금리 대출을 찾아드려요 🔥',
        color: 'text-purple-600',
        icon: '🚀',
      },
      complete: {
        message:
          '완벽해요! 이제 6개 대출 상품을 비교하고 최적의 선택을 하세요! 🎉',
        color: 'text-green-600',
        icon: '✅',
      },
    },
  });

  // 통화 포맷팅 훅 사용
  const { formatCurrency } = useCurrency();

  // 대출 계산 로직 훅 사용
  const { calculateLoan } = useLoanCalculation(formatCurrency);

  const handleCalculateLoan = () => {
    const results = calculateLoan(formData, simulationSettings);
    setLoanResults(results);
    setShowResults(true);
  };

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
        <LoanSimulationHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
              <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <PiggyBank className="h-5 w-5 text-purple-600" />
                <span>대출 조건 입력</span>
              </CardTitle>
              <CardDescription>
                대출 시뮬레이션을 위한 정보를 입력해주세요
              </CardDescription>

                {/* 진행률 바 */}
                <ProgressBar
                  progress={progress}
                  encouragementMessage={encouragementMessage}
                />
            </CardHeader>
            <CardContent className="space-y-6">
                {/* 기본 정보 섹션 */}
                <BasicInfoSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleNumberKeyDown={handleNumberKeyDown}
                  handleNumberPaste={handleNumberPaste}
                  formatCurrency={formatCurrency}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                />

                {/* 개인 정보 섹션 */}
                <PersonalInfoSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleNumberKeyDown={handleNumberKeyDown}
                  handleNumberPaste={handleNumberPaste}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                />

                {/* 시뮬레이션 설정 섹션 */}
                <SimulationSettingsSection
                  simulationSettings={simulationSettings}
                  handleSimulationChange={handleSimulationChange}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                />

              <Button
                  onClick={handleCalculateLoan}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!formData.housePrice || !formData.monthlyIncome}
              >
                대출 조건 확인하기
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {showResults && (
            <div className="space-y-6">
                <LoanResultsCard
                  loanResults={loanResults}
                  selectedLoan={selectedLoan}
                  setSelectedLoan={setSelectedLoan}
                  formatCurrency={(value: number) =>
                    formatCurrency(value.toString())
                  }
                />

              {/* 상세 시뮬레이션 */}
              {selectedLoan && (
                  <LoanDetailCard
                    selectedLoan={selectedLoan}
                    formatCurrency={(value: number) =>
                      formatCurrency(value.toString())
                    }
                  />
              )}
            </div>
          )}
        </div>

        {/* Additional Info */}
          {showResults && <InfoCards />}
          </div>
      </div>
    </TooltipProvider>
  );
};

export default LoanSimulation;
