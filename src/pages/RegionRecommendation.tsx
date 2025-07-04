import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useFormData } from '@/hooks/useFormData';
import { useNumberInput } from '@/hooks/useNumberInput';
import { useProgress } from '@/hooks/useProgress';
import { useCollapsibleSections } from '@/hooks/useCollapsibleSections';
import { useCurrency } from '@/hooks/useCurrency';
import { mockRegionRecommendations } from '@/mocks/regionData';
import type { RegionInfo } from '@/types/region';
import {
  ArrowLeft,
  MapPin,
  Star,
  TrendingUp,
  Car,
  GraduationCap,
  Heart,
  Shield,
  ShoppingCart,
  Utensils,
  Coffee,
  Trees,
  Building2,
  Wifi,
  Hospital,
  Dumbbell,
  Palette,
  Users,
  Info,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import GoogleMap from '@/components/GoogleMap';

// 지역 정보 타입은 @/types/region에서 import

const RegionRecommendation = () => {
  const { formData, handleInputChange } = useFormData({
    budget: '',
    childAge: '',
    workLocation: '',
    priority: '',
    transportType: '',
    lifestyle: '', // 생활 패턴
    familySize: '', // 가족 구성원 수
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
    const budget = parseInt(formData.budget) || 0;

    // 실제로는 formData를 기반으로 필터링하는 로직이 들어갈 수 있습니다
    setRecommendations(mockRegionRecommendations);
    setShowResults(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreIcon = (category: string) => {
    const icons = {
      education: GraduationCap,
      transport: Car,
      infrastructure: Building2,
      safety: Shield,
      environment: Trees,
      culture: Palette,
      commercial: ShoppingCart,
      medical: Hospital,
      lifestyle: Coffee,
      community: Users,
    };
    return icons[category as keyof typeof icons] || MapPin;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                돌아가기
              </Link>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  스마트 지역 추천
                </h1>
                <p className="text-sm text-gray-600">
                  10가지 평가 지표로 분석한 맞춤형 지역 추천
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                <span>상세 선호 조건</span>
              </CardTitle>
              <CardDescription>
                더 정확한 추천을 위해 상세 조건을 입력해주세요
              </CardDescription>

              {/* 진행률 바 */}
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    입력 진행률
                  </span>
                  <span className="text-sm font-bold text-orange-600">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {/* 격려 메시지 */}
                <div
                  className={`text-center p-3 rounded-lg bg-gradient-to-r ${
                    progress === 100
                      ? 'from-green-50 to-blue-50 border border-green-200'
                      : 'from-orange-50 to-red-50 border border-orange-200'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl">
                      {encouragementMessage.icon}
                    </span>
                    <p className={`font-medium ${encouragementMessage.color}`}>
                      {encouragementMessage.message}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 기본 정보 섹션 */}
              <Collapsible
                open={expandedSections.basic}
                onOpenChange={() => toggleSection('basic')}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <span>🏠 기본 정보</span>
                    {formData.budget &&
                      formData.familySize &&
                      formData.childAge &&
                      formData.workLocation && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-700"
                        >
                          ✅ 완료
                        </Badge>
                      )}
                  </h4>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                      expandedSections.basic ? 'transform rotate-180' : ''
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">주택 구매 예산 (만원)</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="예: 50000"
                        value={formData.budget}
                        onChange={(e) =>
                          handleInputChange('budget', e.target.value)
                        }
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        min="0"
                      />
                      {formData.budget && (
                        <p className="text-sm text-green-600 font-medium">
                          🏠 {formatCurrency(formData.budget)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="familySize">가족 구성원 수</Label>
                      <Select
                        value={formData.familySize}
                        onValueChange={(value) =>
                          handleInputChange('familySize', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1인 가구</SelectItem>
                          <SelectItem value="2">2인 가구</SelectItem>
                          <SelectItem value="3">3인 가구</SelectItem>
                          <SelectItem value="4+">4인 이상</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="childAge">자녀 나이</Label>
                    <Select
                      value={formData.childAge}
                      onValueChange={(value) =>
                        handleInputChange('childAge', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preschool">미취학</SelectItem>
                        <SelectItem value="elementary">초등학생</SelectItem>
                        <SelectItem value="middle">중학생</SelectItem>
                        <SelectItem value="high">고등학생</SelectItem>
                        <SelectItem value="adult">성인 자녀</SelectItem>
                        <SelectItem value="none">자녀 없음</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>직장 위치</Label>
                    <Select
                      value={formData.workLocation}
                      onValueChange={(value) =>
                        handleInputChange('workLocation', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gangnam">강남 3구</SelectItem>
                        <SelectItem value="jongno">종로/중구</SelectItem>
                        <SelectItem value="yeouido">여의도</SelectItem>
                        <SelectItem value="pangyo">판교/분당</SelectItem>
                        <SelectItem value="mapo">마포/홍대</SelectItem>
                        <SelectItem value="songdo">송도</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* 선호도 정보 섹션 */}
              <Collapsible
                open={expandedSections.preferences}
                onOpenChange={() => toggleSection('preferences')}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <span>🎯 생활 선호도</span>
                    {formData.lifestyle &&
                      formData.priority &&
                      formData.transportType && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-700"
                        >
                          ✅ 완료
                        </Badge>
                      )}
                  </h4>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                      expandedSections.preferences ? 'transform rotate-180' : ''
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>생활 패턴</Label>
                    <Select
                      value={formData.lifestyle}
                      onValueChange={(value) =>
                        handleInputChange('lifestyle', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urban">
                          도심형 (편의시설 중심)
                        </SelectItem>
                        <SelectItem value="nature">
                          자연형 (공원/산 선호)
                        </SelectItem>
                        <SelectItem value="culture">
                          문화형 (문화시설 중심)
                        </SelectItem>
                        <SelectItem value="family">
                          가족형 (교육/안전 중심)
                        </SelectItem>
                        <SelectItem value="convenience">
                          편의형 (교통/쇼핑 중심)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>최우선 고려사항</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        handleInputChange('priority', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="education">교육환경</SelectItem>
                        <SelectItem value="transport">교통편의</SelectItem>
                        <SelectItem value="price">가격 경쟁력</SelectItem>
                        <SelectItem value="safety">치안/안전</SelectItem>
                        <SelectItem value="environment">자연환경</SelectItem>
                        <SelectItem value="culture">문화/여가</SelectItem>
                        <SelectItem value="medical">의료시설</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>주요 교통수단</Label>
                    <Select
                      value={formData.transportType}
                      onValueChange={(value) =>
                        handleInputChange('transportType', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subway">지하철</SelectItem>
                        <SelectItem value="car">자가용</SelectItem>
                        <SelectItem value="bus">버스</SelectItem>
                        <SelectItem value="mixed">복합</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button
                onClick={generateRecommendations}
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={!formData.budget || !formData.priority}
              >
                정밀 지역 분석 시작
              </Button>
            </CardContent>
          </Card>

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>추천 지역 지도</span>
              </CardTitle>
              <CardDescription>추천 지역의 위치와 특성</CardDescription>
            </CardHeader>
            <CardContent>
              {showResults ? (
                <div className="h-80">
                  <GoogleMap recommendations={recommendations} />
                </div>
              ) : (
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      지역 추천 후 지도가 표시됩니다
                    </p>
                  </div>
                </div>
              )}

              {showResults && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-gray-900">
                    추천 지역 요약
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">평균 가격대:</span>
                      <span className="font-semibold ml-2">4-6억원</span>
                    </div>
                    <div>
                      <span className="text-gray-600">추천 개수:</span>
                      <span className="font-semibold ml-2">
                        {recommendations.length}개 지역
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">평균 매칭도:</span>
                      <span className="font-semibold ml-2">
                        {Math.round(
                          recommendations.reduce(
                            (sum, r) => sum + r.matchScore,
                            0
                          ) / recommendations.length
                        )}
                        점
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">분석 항목:</span>
                      <span className="font-semibold ml-2">10개 지표</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        {showResults && (
          <div className="mt-8 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              정밀 지역 분석 결과
            </h3>

            {recommendations.map((region, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        {region.name}
                      </CardTitle>
                      <CardDescription className="text-lg font-semibold text-blue-600">
                        {region.averagePrice}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-bold text-lg">
                          {region.matchScore}
                        </span>
                        <span className="text-sm text-gray-500">/ 100</span>
                      </div>
                      <Badge
                        variant={
                          region.priceChange.startsWith('+')
                            ? 'destructive'
                            : 'default'
                        }
                        className="text-xs"
                      >
                        {region.priceChange}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="scores" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="scores">평가 점수</TabsTrigger>
                      <TabsTrigger value="details">상세 정보</TabsTrigger>
                      <TabsTrigger value="analysis">가격 분석</TabsTrigger>
                    </TabsList>

                    <TabsContent value="scores" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(region.scores).map(([key, score]) => {
                          const IconComponent = getScoreIcon(key);
                          const labels: Record<string, string> = {
                            education: '교육환경',
                            transport: '교통편의',
                            infrastructure: '생활인프라',
                            safety: '치안/안전',
                            environment: '환경/자연',
                            culture: '문화/여가',
                            commercial: '상업시설',
                            medical: '의료시설',
                            lifestyle: '생활편의',
                            community: '커뮤니티',
                          };

                          return (
                            <div
                              key={key}
                              className="flex items-center space-x-3"
                            >
                              <IconComponent className="h-5 w-5 text-gray-600" />
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm text-gray-600">
                                    {labels[key]}
                                  </span>
                                  <span
                                    className={`font-semibold ${getScoreColor(
                                      score
                                    )}`}
                                  >
                                    {score}/10
                                  </span>
                                </div>
                                <Progress value={score * 10} className="h-2" />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          주요 특징
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {region.highlights.map(
                            (highlight: string, idx: number) => (
                              <Badge key={idx} variant="secondary">
                                {highlight}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            주요 학교
                          </h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {region.details.schools.map(
                              (school: string, idx: number) => (
                                <li key={idx}>• {school}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Hospital className="h-4 w-4 mr-2" />
                            의료시설
                          </h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {region.details.hospitals.map(
                              (hospital: string, idx: number) => (
                                <li key={idx}>• {hospital}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            쇼핑/상업시설
                          </h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {region.details.shopping.map(
                              (shop: string, idx: number) => (
                                <li key={idx}>• {shop}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Trees className="h-4 w-4 mr-2" />
                            공원/자연
                          </h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {region.details.parks.map(
                              (park: string, idx: number) => (
                                <li key={idx}>• {park}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Palette className="h-4 w-4 mr-2" />
                            문화시설
                          </h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {region.details.cultural.map(
                              (cultural: string, idx: number) => (
                                <li key={idx}>• {cultural}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Car className="h-4 w-4 mr-2" />
                            교통망
                          </h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {region.details.transport.map(
                              (transport: string, idx: number) => (
                                <li key={idx}>• {transport}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3">
                            가격 전망 (근거 기반)
                          </h5>
                          <div className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 font-medium">
                                  3년 평균 상승률:
                                </span>
                                <span className="font-semibold text-green-600">
                                  연 {region.priceChange.replace('+', '')}{' '}
                                  (실거래가 기준)
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                국토교통부 실거래가 데이터 (2021-2024)
                              </p>
                            </div>

                            <div className="p-3 bg-blue-50 rounded">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 font-medium">
                                  개발 호재:
                                </span>
                                <span className="font-semibold text-blue-600">
                                  {region.priceAnalysis.developmentPlan.length}
                                  개 프로젝트
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                정부/지자체 발표 개발계획 기준
                              </p>
                            </div>

                            <div className="p-3 bg-purple-50 rounded">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 font-medium">
                                  시장 전망:
                                </span>
                                <span className="font-semibold text-purple-600">
                                  {region.priceAnalysis.futureProspect}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                KB부동산, 한국부동산원 전망 종합
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3">
                            개발 계획
                          </h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {region.priceAnalysis.developmentPlan.map(
                              (plan: string, idx: number) => (
                                <li key={idx}>• {plan}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold text-blue-800 mb-3">
                          💡 투자 관점 분석
                        </h5>
                        <div className="text-sm text-blue-700 space-y-3">
                          <div className="p-3 bg-white rounded border-l-4 border-blue-400">
                            <p className="font-medium mb-1">
                              🏗️ 개발 계획 기반 분석
                            </p>
                            <p>
                              • 해당 지역의 도시계획시설 결정 및 개발계획
                              (국토교통부, 2024)
                            </p>
                            <p>• 교통망 확충 계획: 지하철 연장, 도로 개설 등</p>
                            <p>• 정부 발표 신도시/재개발 계획 반영</p>
                          </div>

                          <div className="p-3 bg-white rounded border-l-4 border-green-400">
                            <p className="font-medium mb-1">
                              📊 시장 데이터 기반 분석
                            </p>
                            <p>
                              • 부동산 실거래가 동향 (국토교통부 실거래가
                              공개시스템, 최근 3년)
                            </p>
                            <p>• 전세가율, 매매/전세 비율 등 시장 지표</p>
                            <p>• 같은 생활권 내 유사 단지 거래 현황</p>
                          </div>

                          <div className="p-3 bg-white rounded border-l-4 border-purple-400">
                            <p className="font-medium mb-1">🏫 인프라 평가</p>
                            <p>• 학군 정보: 교육청 학교알리미 데이터</p>
                            <p>• 교통편의성: 대중교통 접근성 및 도로망</p>
                            <p>• 상업시설 밀도: 반경 1km 내 편의시설 개수</p>
                          </div>

                          <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                            ⚠️ <strong>투자 유의사항</strong>
                            <br />본 분석은 공개된 정보와 과거 데이터를 바탕으로
                            한 참고 자료입니다. 실제 투자 결정 시에는 전문가
                            상담과 추가적인 시장 조사를 권장드립니다.
                          </div>

                          <div className="mt-2 text-xs text-blue-600">
                            <p>
                              <strong>데이터 출처:</strong>
                            </p>
                            <p>• 국토교통부 실거래가 공개시스템</p>
                            <p>• 한국부동산원 부동산통계정보</p>
                            <p>• 각 지방자치단체 도시계획정보</p>
                            <p>• 교육부 학교알리미 (교육환경 평가)</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionRecommendation;
