import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  GraduationCap,
  Hospital,
  ShoppingCart,
  Trees,
  Palette,
  Car,
} from 'lucide-react';
import type { RegionInfo } from '@/types/region';

interface RegionRecommendationCardProps {
  region: RegionInfo;
}

const RegionRecommendationCard = ({
  region,
}: RegionRecommendationCardProps) => {
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
      infrastructure: Hospital,
      safety: ShoppingCart,
      environment: Trees,
      culture: Palette,
      commercial: ShoppingCart,
      medical: Hospital,
      lifestyle: Trees,
      community: Star,
    };
    return icons[category as keyof typeof icons] || Star;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
              <span className="font-bold text-lg">{region.matchScore}</span>
              <span className="text-sm text-gray-500">/ 100</span>
            </div>
            <Badge
              variant={
                region.priceChange.startsWith('+') ? 'destructive' : 'default'
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
                  <div key={key} className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">
                          {labels[key]}
                        </span>
                        <span
                          className={`font-semibold ${getScoreColor(score)}`}
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
              <h4 className="font-semibold text-gray-900 mb-2">주요 특징</h4>
              <div className="flex flex-wrap gap-2">
                {region.highlights.map((highlight: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {highlight}
                  </Badge>
                ))}
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
                  {region.details.schools.map((school: string, idx: number) => (
                    <li key={idx}>• {school}</li>
                  ))}
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
                  {region.details.shopping.map((shop: string, idx: number) => (
                    <li key={idx}>• {shop}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Trees className="h-4 w-4 mr-2" />
                  공원/자연
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {region.details.parks.map((park: string, idx: number) => (
                    <li key={idx}>• {park}</li>
                  ))}
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
                        연 {region.priceChange.replace('+', '')} (실거래가 기준)
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
                        {region.priceAnalysis.developmentPlan.length}개 프로젝트
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
                <h5 className="font-semibold text-gray-900 mb-3">개발 계획</h5>
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
                  <p className="font-medium mb-1">🏗️ 개발 계획 기반 분석</p>
                  <p>
                    • 해당 지역의 도시계획시설 결정 및 개발계획 (국토교통부,
                    2024)
                  </p>
                  <p>• 교통망 확충 계획: 지하철 연장, 도로 개설 등</p>
                  <p>• 정부 발표 신도시/재개발 계획 반영</p>
                </div>

                <div className="p-3 bg-white rounded border-l-4 border-green-400">
                  <p className="font-medium mb-1">📊 시장 데이터 기반 분석</p>
                  <p>
                    • 부동산 실거래가 동향 (국토교통부 실거래가 공개시스템, 최근
                    3년)
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
                  <br />본 분석은 공개된 정보와 과거 데이터를 바탕으로 한 참고
                  자료입니다. 실제 투자 결정 시에는 전문가 상담과 추가적인 시장
                  조사를 권장드립니다.
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
  );
};

export default RegionRecommendationCard;
