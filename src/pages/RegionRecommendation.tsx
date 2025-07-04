import { useState } from 'react';
import { useFormData } from '@/hooks/useFormData';
import { useNumberInput } from '@/hooks/useNumberInput';
import { useProgress } from '@/hooks/useProgress';
import { useCollapsibleSections } from '@/hooks/useCollapsibleSections';
import { useCurrency } from '@/hooks/useCurrency';
import RegionRecommendationHeader from '@/components/region/RegionRecommendationHeader';
import RegionForm from '@/components/region/RegionForm';
import RegionMapCard from '@/components/region/RegionMapCard';
import RegionRecommendationCard from '@/components/region/RegionRecommendationCard';
import { mockRegionRecommendations } from '@/mocks/regionData';
import type { RegionInfo } from '@/types/region';

const RegionRecommendation = () => {
  const { formData, handleInputChange } = useFormData({
    budget: '',
    childAge: '',
    workLocation: '',
    priority: '',
    transportType: '',
    lifestyle: '',
    familySize: '',
  });

  const [recommendations, setRecommendations] = useState<RegionInfo[]>([]);
  const [showResults, setShowResults] = useState(false);

  // 섹션별 접기/펼치기 상태
  const { expandedSections, toggleSection } = useCollapsibleSections({
    basic: true,
    preferences: false,
  });

  // 숫자 입력 검증 훅 사용
  const { handleNumberKeyDown, handleNumberPaste } = useNumberInput();

  // 통화 포맷팅 훅 사용
  const { formatCurrency } = useCurrency();

  // 진행률 계산 및 격려 메시지 훅 사용
  const requiredFields = [
    'budget',
    'familySize',
    'childAge',
    'workLocation',
    'priority',
    'transportType',
    'lifestyle',
  ];

  const { progress, encouragementMessage } = useProgress({
    formData,
    requiredFields,
    encouragementMessages: {
      start: {
        message: '완벽한 우리 동네를 찾아보세요! 기본 정보를 입력해주세요 🗺️',
        color: 'text-orange-600',
        icon: '🎯',
      },
      progress30: {
        message: '좋은 출발이에요! 계속 입력해서 맞춤 지역을 찾아보세요 ✨',
        color: 'text-green-600',
        icon: '📝',
      },
      progress70: {
        message:
          '절반 넘었어요! 조금만 더 입력하면 10가지 지표로 분석한 결과를 확인해요 💪',
        color: 'text-blue-600',
        icon: '📊',
      },
      nearComplete: {
        message:
          '거의 완성! 마지막 선호도만 입력하면 Google 지도로 확인해드려요 🔥',
        color: 'text-purple-600',
        icon: '🚀',
      },
      complete: {
        message:
          '완벽해요! 이제 3개 지역을 비교하고 Google 지도에서 확인하세요! 🎉',
        color: 'text-green-600',
        icon: '✅',
      },
    },
  });

  const generateRecommendations = () => {
    setRecommendations(mockRegionRecommendations);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <RegionRecommendationHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RegionForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleNumberKeyDown={handleNumberKeyDown}
            handleNumberPaste={handleNumberPaste}
            formatCurrency={formatCurrency}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            progress={progress}
            encouragementMessage={encouragementMessage}
            onGenerateRecommendations={generateRecommendations}
          />

          <RegionMapCard
            showResults={showResults}
            recommendations={recommendations}
          />
        </div>

        {/* Recommendations */}
        {showResults && (
          <div className="mt-8 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              정밀 지역 분석 결과
            </h3>

            {recommendations.map((region, index) => (
              <RegionRecommendationCard key={index} region={region} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionRecommendation;
