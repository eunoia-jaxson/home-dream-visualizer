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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { MapPin, ChevronDown } from 'lucide-react';
import ProgressBar from '@/components/loan/ProgressBar';

interface FormData {
  budget: string;
  childAge: string;
  workLocation: string;
  priority: string;
  transportType: string;
  lifestyle: string;
  familySize: string;
}

interface RegionFormProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  handleNumberKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleNumberPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  formatCurrency: (value: string) => string;
  expandedSections: { basic: boolean; preferences: boolean };
  toggleSection: (section: string) => void;
  progress: number;
  encouragementMessage: { icon: string; message: string; color: string };
  onGenerateRecommendations: () => void;
}

const RegionForm = ({
  formData,
  handleInputChange,
  handleNumberKeyDown,
  handleNumberPaste,
  formatCurrency,
  expandedSections,
  toggleSection,
  progress,
  encouragementMessage,
  onGenerateRecommendations,
}: RegionFormProps) => {
  return (
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
        <ProgressBar
          progress={progress}
          encouragementMessage={encouragementMessage}
        />
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
                  onChange={(e) => handleInputChange('budget', e.target.value)}
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
                onValueChange={(value) => handleInputChange('childAge', value)}
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
                onValueChange={(value) => handleInputChange('lifestyle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">도심형 (편의시설 중심)</SelectItem>
                  <SelectItem value="nature">자연형 (공원/산 선호)</SelectItem>
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
                onValueChange={(value) => handleInputChange('priority', value)}
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
          onClick={onGenerateRecommendations}
          className="w-full bg-orange-600 hover:bg-orange-700"
          disabled={!formData.budget || !formData.priority}
        >
          정밀 지역 분석 시작
        </Button>
      </CardContent>
    </Card>
  );
};

export default RegionForm;
