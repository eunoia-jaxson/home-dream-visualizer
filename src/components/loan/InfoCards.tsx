import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Shield, AlertCircle, TrendingDown, Info } from 'lucide-react';

const InfoCards = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>DSR/DTI 규제 안내</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <h4 className="font-semibold text-blue-900">
                DSR (총부채원리금상환비율)
              </h4>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 ml-2 text-blue-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">DSR 계산 방법</p>
                  <p>DSR = (모든 대출 월 상환액 × 12) ÷ 연소득 × 100</p>
                  <p className="text-xs text-gray-500 mt-1">
                    주택담보대출, 신용대출, 카드론 등 모든 대출 포함
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-blue-800 mb-2">
              연소득 대비 모든 대출의 연간 원리금 상환액 비율
            </p>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                • <strong>일반지역:</strong> 40% 이하 (연소득 1억원 초과 시 35%)
              </p>
              <p>
                • <strong>투기과열지구:</strong> 30% 이하
              </p>
              <p>
                • <strong>예시:</strong> 연소득 6천만원 → DSR 40% 기준 월 상환액
                200만원 한도
              </p>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-2">
              <h4 className="font-semibold text-purple-900">
                DTI (총부채상환비율)
              </h4>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 ml-2 text-purple-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">DTI 계산 방법</p>
                  <p>DTI = (모든 대출 연간 이자) ÷ 연소득 × 100</p>
                  <p className="text-xs text-gray-500 mt-1">
                    DSR과 달리 원금 상환액은 제외하고 이자만 계산
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-purple-800 mb-2">
              연소득 대비 모든 대출의 연간 이자상환액 비율
            </p>
            <div className="text-xs text-purple-700 space-y-1">
              <p>
                • <strong>일반지역:</strong> 50-60% 이하 (지역별 차등)
              </p>
              <p>
                • <strong>투기과열지구:</strong> 40% 이하
              </p>
              <p>
                • <strong>예시:</strong> 연소득 6천만원 → DTI 50% 기준 연간 이자
                3천만원 한도
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <span>대출 이용 시 주의사항</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              정부 지원 대출
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• 소득 및 자산 기준 엄격 심사</li>
              <li>• 실거주 목적만 가능 (투자 불가)</li>
              <li>• 중도상환 수수료 면제 혜택</li>
              <li>• 대출 후 의무 거주 기간 존재</li>
              <li>• 신청 시기 및 물량 제한</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              시중은행 대출
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• 신용도에 따른 금리 차등 적용</li>
              <li>• DSR/DTI 규제 엄격 적용</li>
              <li>• 중도상환 수수료 발생 가능</li>
              <li>• 담보인정비율(LTV) 제한</li>
              <li>• 금리 변동 위험 고려 필요</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-green-600" />
            <span>금리 우대 조건</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">생애최초 우대</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex justify-between">
                  <span>금리 우대:</span>
                  <span className="font-medium text-green-600">-0.2%p</span>
                </p>
                <p>• 무주택자 대상</p>
                <p>• 실거주 목적 한정</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">신혼부부 우대</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex justify-between">
                  <span>금리 우대:</span>
                  <span className="font-medium text-green-600">-0.2%p</span>
                </p>
                <p>• 결혼 7년 이내</p>
                <p>• 부부 합산 연령 70세 이하</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">다자녀 우대</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex justify-between">
                  <span>2자녀 이상:</span>
                  <span className="font-medium text-green-600">-0.3%p</span>
                </p>
                <p className="flex justify-between">
                  <span>1자녀:</span>
                  <span className="font-medium text-green-600">-0.1%p</span>
                </p>
                <p>• 만 18세 이하 자녀</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoCards;
