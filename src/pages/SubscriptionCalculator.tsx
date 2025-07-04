import { useState } from 'react';
import { useFormData } from '@/hooks/useFormData';
import { useNumberInput } from '@/hooks/useNumberInput';
import { useProgress } from '@/hooks/useProgress';
import { useCollapsibleSections } from '@/hooks/useCollapsibleSections';
import { useCurrency } from '@/hooks/useCurrency';
import { useSubscriptionCalculation } from '@/hooks/useSubscriptionCalculation';
import type { EligibilityResult, Recommendation } from '@/types/subscription';

// 컴포넌트들 import
import SubscriptionCalculatorHeader from '@/components/subscription/SubscriptionCalculatorHeader';
import SubscriptionTypeSelector from '@/components/subscription/SubscriptionTypeSelector';
import TypeRequirements from '@/components/subscription/TypeRequirements';
import SubscriptionForm from '@/components/subscription/SubscriptionForm';
import CalculationResult from '@/components/subscription/CalculationResult';
import RecommendationsList from '@/components/subscription/RecommendationsList';

const SubscriptionCalculator = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const { formData, handleInputChange } = useFormData({
    // 공통 정보
    householdPeriod: '',
    dependents: '',
    subscriptionPeriod: '',
    area: '',

    // 신혼부부 특별공급 전용
    marriagePeriod: '',
    monthlyIncome: '',
    totalAssets: '',

    // 생애최초 특별공급 전용
    age: '',
    taxPaymentPeriod: '',

    // 다자녀가구 특별공급 전용
    childrenCount: '',

    // 노부모부양 특별공급 전용
    parentSupportPeriod: '',
  });

  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [eligibilityResult, setEligibilityResult] =
    useState<EligibilityResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // 섹션별 접기/펼치기 상태
  const { expandedSections, toggleSection } = useCollapsibleSections({
    common: false,
    specific: false,
  });

  // 숫자 입력 검증 훅 사용
  const { handleNumberKeyDown, handleNumberPaste } = useNumberInput();

  // 통화 포맷팅 훅 사용
  const { formatCurrency } = useCurrency();

  // 청약 계산 로직 훅 사용
  const { calculateScore, generateRecommendations } =
    useSubscriptionCalculation();

  // 진행률 계산을 위한 필드 정의
  const getRequiredFields = () => {
    const requiredFields = ['selectedType'];

    if (selectedType) {
      // 공통 필드 추가
      requiredFields.push(
        'householdPeriod',
        'dependents',
        'subscriptionPeriod'
      );

      // 유형별 필수 필드 추가
      if (selectedType === 'newlywed') {
        requiredFields.push('marriagePeriod', 'monthlyIncome', 'totalAssets');
      } else if (selectedType === 'first_life') {
        requiredFields.push('age', 'taxPaymentPeriod');
      } else if (selectedType === 'multi_child') {
        requiredFields.push('childrenCount');
      } else if (selectedType === 'old_parent') {
        requiredFields.push('parentSupportPeriod');
      }
    }

    return requiredFields;
  };

  // 진행률 계산 및 격려 메시지 훅 사용
  const { progress, encouragementMessage } = useProgress({
    formData: { ...formData, selectedType },
    requiredFields: getRequiredFields(),
    encouragementMessages: {
      start: {
        message: '청약 꿈을 이루어보세요! 청약 유형을 선택해주세요 🏠',
        color: 'text-blue-600',
        icon: '🎯',
      },
      progress30: {
        message: '좋은 선택이에요! 기본 정보를 입력해보세요 ✨',
        color: 'text-green-600',
        icon: '📝',
      },
      progress70: {
        message:
          '절반 넘었어요! 조금만 더 입력하면 청약 점수를 확인할 수 있어요 💪',
        color: 'text-blue-600',
        icon: '📊',
      },
      nearComplete: {
        message:
          '거의 완성! 마지막 정보만 입력하면 맞춤 추천을 받을 수 있어요 🔥',
        color: 'text-purple-600',
        icon: '🚀',
      },
      complete: {
        message:
          '완벽해요! 이제 청약 점수를 계산하고 맞춤 추천을 받아보세요! 🎉',
        color: 'text-green-600',
        icon: '✅',
      },
    },
  });

  const handleCalculateScore = () => {
    if (!selectedType) return;

    const result = calculateScore(selectedType, formData);
    setEligibilityResult(result.eligibility);
    setCalculatedScore(result.score);

    if (result.score !== null) {
      const recommendations = generateRecommendations(
        result.score,
        selectedType
      );
      setRecommendations(recommendations);
    } else {
      setRecommendations([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <SubscriptionCalculatorHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 청약 유형 선택 */}
        <SubscriptionTypeSelector
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        {/* 선택된 유형의 상세 정보 */}
        <TypeRequirements selectedType={selectedType} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <SubscriptionForm
            selectedType={selectedType}
            formData={formData}
            handleInputChange={handleInputChange}
            handleNumberKeyDown={handleNumberKeyDown}
            handleNumberPaste={handleNumberPaste}
            formatCurrency={formatCurrency}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            progress={progress}
            encouragementMessage={encouragementMessage}
            onCalculate={handleCalculateScore}
          />

          {/* Results */}
          {selectedType && eligibilityResult && (
            <CalculationResult
              selectedType={selectedType}
              eligibilityResult={eligibilityResult}
              calculatedScore={calculatedScore}
            />
          )}
        </div>

        {/* Recommendations */}
        <RecommendationsList recommendations={recommendations} />
      </div>
    </div>
  );
};

export default SubscriptionCalculator;
