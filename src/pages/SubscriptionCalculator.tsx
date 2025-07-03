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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Calculator,
  Award,
  MapPin,
  Info,
  Users,
  Heart,
  Home,
  Building,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// 타입 정의
interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

interface Recommendation {
  name: string;
  location: string;
  type: string;
  subscriptionType: string;
  minScore: number;
  competition: string;
  price: string;
  canApply: boolean;
}

// 청약 유형별 설명 데이터
const subscriptionTypes = {
  general_first: {
    name: '일반공급 1순위 (가점제)',
    icon: Building,
    description:
      '무주택기간, 부양가족 수, 청약통장 가입기간을 합산하여 가점이 높은 순으로 당첨',
    requirements: [
      '무주택세대주 또는 세대원',
      '청약통장 가입 2년 이상',
      '85㎡ 이하는 1순위자 중 가점제(40%) + 추첨제(60%)',
      '85㎡ 초과는 1순위자 중 추첨제(100%)',
    ],
    maxScore: 84,
  },
  general_second: {
    name: '일반공급 2순위',
    icon: Users,
    description: '1순위 조건에 해당하지 않는 경우, 추첨으로 당첨자 선정',
    requirements: [
      '청약통장 가입자 중 1순위가 아닌 경우',
      '100% 추첨제로 선정',
    ],
    maxScore: 0,
  },
  newlywed: {
    name: '신혼부부 특별공급',
    icon: Heart,
    description:
      '혼인 7년 이내 무주택 신혼부부 대상, 소득 및 자산 기준 충족 시 신청 가능',
    requirements: [
      '혼인신고일로부터 7년 이내',
      '무주택세대주',
      '부부합산 월평균소득이 전년도 도시근로자 가구원수별 가구당 월평균소득의 140% 이하',
      '총자산 3.61억원 이하, 자동차 3,557만원 이하',
    ],
    maxScore: 75,
  },
  first_life: {
    name: '생애최초 특별공급',
    icon: Home,
    description:
      '생애최초로 주택을 구입하는 무주택세대주, 소득 및 자산 기준 충족 시 신청 가능',
    requirements: [
      '세대주를 포함하여 세대원 전원이 과거 주택을 소유한 사실이 없는 자',
      '세대주 연령 만 40세 이상 (단, 배우자가 있는 경우 만 30세 이상)',
      '5년 이상 소득세 납부',
      '월평균소득이 전년도 도시근로자 가구원수별 가구당 월평균소득의 130% 이하',
    ],
    maxScore: 75,
  },
  multi_child: {
    name: '다자녀가구 특별공급',
    icon: Users,
    description: '만 19세 미만 자녀 3명 이상을 양육하는 무주택세대주',
    requirements: [
      '만 19세 미만 자녀 3명 이상',
      '무주택세대주',
      '당첨자 선정 기준: 미성년 자녀 수, 세대구성(3세대 이상), 무주택기간, 해당 시·도 거주기간 순',
    ],
    maxScore: 75,
  },
  old_parent: {
    name: '노부모부양 특별공급',
    icon: Heart,
    description: '만 65세 이상 직계존속을 3년 이상 부양하는 무주택세대주',
    requirements: [
      '만 65세 이상 직계존속을 3년 이상 계속 부양',
      '무주택세대주',
      '청약통장 가입 1년 이상',
    ],
    maxScore: 75,
  },
};

const SubscriptionCalculator = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState({
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 만원 단위를 읽기 쉬운 형태로 변환하는 함수
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseInt(amount) : amount;
    if (!num || num === 0) return '';

    if (num >= 100000000) {
      // 1조 이상 (100,000,000만원 = 1조)
      const jo = Math.floor(num / 100000000);
      const remainder = num % 100000000;

      if (remainder === 0) {
        return `${jo}조원`;
      } else if (remainder >= 10000) {
        const eok = Math.floor(remainder / 10000);
        const eokRemainder = remainder % 10000;
        if (eokRemainder === 0) {
          return `${jo}조 ${eok}억원`;
        } else {
          return `${jo}조 ${eok}억 ${eokRemainder}만원`;
        }
      } else {
        return `${jo}조 ${remainder}만원`;
      }
    } else if (num >= 10000) {
      // 1억 이상
      const eok = Math.floor(num / 10000);
      const remainder = num % 10000;

      if (remainder === 0) {
        return `${eok}억원`;
      } else if (remainder >= 1000) {
        const thousand = Math.floor(remainder / 1000);
        const remaining = remainder % 1000;
        if (remaining === 0) {
          return `${eok}억 ${thousand}천만원`;
        } else {
          return `${eok}억 ${remainder}만원`;
        }
      } else {
        return `${eok}억 ${remainder}만원`;
      }
    } else if (num >= 1000) {
      // 1천만 이상
      const thousand = Math.floor(num / 1000);
      const remainder = num % 1000;
      if (remainder === 0) {
        return `${thousand}천만원`;
      } else {
        return `${thousand}천 ${remainder}만원`;
      }
    } else {
      return `${num}만원`;
    }
  };

  const calculateGeneralScore = () => {
    let score = 0;

    // 무주택 기간 점수 (최대 32점)
    const householdYears = parseInt(formData.householdPeriod) || 0;
    let householdScore = 0;
    if (householdYears >= 15) householdScore = 32;
    else if (householdYears >= 10) householdScore = 28;
    else if (householdYears >= 5) householdScore = 24;
    else if (householdYears >= 2) householdScore = 20;
    else householdScore = 16;

    score += householdScore;

    // 부양가족 점수 (최대 35점)
    const dependentsCount = parseInt(formData.dependents) || 0;
    let dependentsScore = 5; // 기본점수
    if (dependentsCount >= 6) dependentsScore = 35;
    else if (dependentsCount >= 4) dependentsScore = 30;
    else if (dependentsCount >= 3) dependentsScore = 25;
    else if (dependentsCount >= 2) dependentsScore = 20;
    else if (dependentsCount >= 1) dependentsScore = 15;

    score += dependentsScore;

    // 청약통장 가입기간 점수 (최대 17점)
    const subscriptionYears = parseInt(formData.subscriptionPeriod) || 0;
    let subscriptionScore = 0;
    if (subscriptionYears >= 15) subscriptionScore = 17;
    else if (subscriptionYears >= 10) subscriptionScore = 15;
    else if (subscriptionYears >= 5) subscriptionScore = 12;
    else if (subscriptionYears >= 2) subscriptionScore = 10;
    else subscriptionScore = 5;

    score += subscriptionScore;

    return {
      total: score,
      breakdown: {
        household: householdScore,
        dependents: dependentsScore,
        subscription: subscriptionScore,
      },
    };
  };

  const checkEligibility = (type: string) => {
    const householdYears = parseInt(formData.householdPeriod) || 0;
    const subscriptionYears = parseInt(formData.subscriptionPeriod) || 0;

    switch (type) {
      case 'general_first':
        return {
          eligible: subscriptionYears >= 2,
          reasons:
            subscriptionYears < 2 ? ['청약통장 가입기간이 2년 미만입니다'] : [],
        };

      case 'newlywed': {
        const marriageYears = parseInt(formData.marriagePeriod) || 0;
        const monthlyIncome = parseInt(formData.monthlyIncome) || 0;
        const totalAssets = parseInt(formData.totalAssets) || 0;

        const reasons = [];
        if (marriageYears > 7) reasons.push('혼인기간이 7년을 초과했습니다');
        if (householdYears === 0) reasons.push('무주택세대주가 아닙니다');
        if (monthlyIncome > 700) reasons.push('소득기준을 초과했습니다'); // 임시 기준
        if (totalAssets > 36100) reasons.push('자산기준을 초과했습니다'); // 임시 기준

        return {
          eligible:
            marriageYears <= 7 &&
            householdYears > 0 &&
            monthlyIncome <= 700 &&
            totalAssets <= 36100,
          reasons,
        };
      }

      case 'first_life': {
        const age = parseInt(formData.age) || 0;
        const taxYears = parseInt(formData.taxPaymentPeriod) || 0;

        const firstLifeReasons = [];
        if (age < 30) firstLifeReasons.push('연령이 만 30세 미만입니다');
        if (taxYears < 5)
          firstLifeReasons.push('소득세 납부기간이 5년 미만입니다');
        if (householdYears === 0)
          firstLifeReasons.push('무주택세대주가 아닙니다');

        return {
          eligible: age >= 30 && taxYears >= 5 && householdYears > 0,
          reasons: firstLifeReasons,
        };
      }

      case 'multi_child': {
        const childrenCount = parseInt(formData.childrenCount) || 0;

        return {
          eligible: childrenCount >= 3 && householdYears > 0,
          reasons:
            childrenCount < 3
              ? ['만 19세 미만 자녀가 3명 미만입니다']
              : householdYears === 0
              ? ['무주택세대주가 아닙니다']
              : [],
        };
      }

      case 'old_parent': {
        const supportYears = parseInt(formData.parentSupportPeriod) || 0;

        return {
          eligible:
            supportYears >= 3 && subscriptionYears >= 1 && householdYears > 0,
          reasons:
            supportYears < 3
              ? ['노부모 부양기간이 3년 미만입니다']
              : subscriptionYears < 1
              ? ['청약통장 가입기간이 1년 미만입니다']
              : householdYears === 0
              ? ['무주택세대주가 아닙니다']
              : [],
        };
      }

      default:
        return { eligible: true, reasons: [] };
    }
  };

  const calculateScore = () => {
    if (!selectedType) return;

    const eligibility = checkEligibility(selectedType);
    setEligibilityResult(eligibility);

    if (!eligibility.eligible) {
      setCalculatedScore(null);
      return;
    }

    let score = 0;
    let breakdown = {};

    if (selectedType === 'general_first' || selectedType === 'general_second') {
      const result = calculateGeneralScore();
      score = result.total;
      breakdown = result.breakdown;
    } else {
      // 특별공급의 경우 기본 가점 + 특별 가점
      const baseResult = calculateGeneralScore();
      score = Math.min(baseResult.total, 65); // 특별공급은 일반공급보다 낮은 점수
      breakdown = baseResult.breakdown;
    }

    setCalculatedScore(score);
    generateRecommendations(score, selectedType);
  };

  const generateRecommendations = (score: number, type: string) => {
    const mockRecommendations = [
      {
        name: '힐스테이트 송도',
        location: '인천 연수구',
        type: '민간분양',
        subscriptionType: '일반공급',
        minScore: 45,
        competition: '3.2:1',
        price: '4억 5천만원',
        canApply:
          score >= 45 && (type.includes('general') || type === 'newlywed'),
      },
      {
        name: '래미안 위브',
        location: '경기 성남시',
        type: '민간분양',
        subscriptionType: '특별공급',
        minScore: 40,
        competition: '2.8:1',
        price: '5억 2천만원',
        canApply: score >= 40 && !type.includes('general'),
      },
      {
        name: '푸르지오 센트럴파크',
        location: '서울 노원구',
        type: '민간분양',
        subscriptionType: '일반공급',
        minScore: 55,
        competition: '8.3:1',
        price: '6억 8천만원',
        canApply: score >= 55 && type.includes('general'),
      },
      {
        name: '신혼희망타운',
        location: '경기 화성시',
        type: '공공분양',
        subscriptionType: '신혼부부특별공급',
        minScore: 30,
        competition: '1.5:1',
        price: '3억 2천만원',
        canApply: score >= 30 && type === 'newlywed',
      },
    ];

    setRecommendations(mockRecommendations.filter((item) => item.canApply));
  };

  const renderFormFields = () => {
    const type =
      subscriptionTypes[selectedType as keyof typeof subscriptionTypes];
    if (!type) return null;

    return (
      <div className="space-y-6">
        {/* 공통 필드 */}
        <div className="space-y-2">
          <Label htmlFor="householdPeriod">무주택 세대주 기간 (년)</Label>
          <Input
            id="householdPeriod"
            type="number"
            placeholder="예: 5"
            value={formData.householdPeriod}
            onChange={(e) =>
              handleInputChange('householdPeriod', e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dependents">부양가족 수 (명)</Label>
          <Input
            id="dependents"
            type="number"
            placeholder="예: 2"
            value={formData.dependents}
            onChange={(e) => handleInputChange('dependents', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subscriptionPeriod">청약통장 가입기간 (년)</Label>
          <Input
            id="subscriptionPeriod"
            type="number"
            placeholder="예: 3"
            value={formData.subscriptionPeriod}
            onChange={(e) =>
              handleInputChange('subscriptionPeriod', e.target.value)
            }
          />
        </div>

        {/* 유형별 추가 필드 */}
        {selectedType === 'newlywed' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="marriagePeriod">혼인기간 (년)</Label>
              <Input
                id="marriagePeriod"
                type="number"
                placeholder="예: 3"
                value={formData.marriagePeriod}
                onChange={(e) =>
                  handleInputChange('marriagePeriod', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">부부합산 월소득 (만원)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                placeholder="예: 500"
                value={formData.monthlyIncome}
                onChange={(e) =>
                  handleInputChange('monthlyIncome', e.target.value)
                }
              />
              {formData.monthlyIncome && (
                <p className="text-sm text-blue-600 font-medium">
                  💰 {formatCurrency(formData.monthlyIncome)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalAssets">총자산 (만원)</Label>
              <Input
                id="totalAssets"
                type="number"
                placeholder="예: 20000"
                value={formData.totalAssets}
                onChange={(e) =>
                  handleInputChange('totalAssets', e.target.value)
                }
              />
              {formData.totalAssets && (
                <p className="text-sm text-green-600 font-medium">
                  💎 {formatCurrency(formData.totalAssets)}
                </p>
              )}
            </div>
          </>
        )}

        {selectedType === 'first_life' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="age">세대주 나이</Label>
              <Input
                id="age"
                type="number"
                placeholder="예: 35"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxPaymentPeriod">소득세 납부기간 (년)</Label>
              <Input
                id="taxPaymentPeriod"
                type="number"
                placeholder="예: 8"
                value={formData.taxPaymentPeriod}
                onChange={(e) =>
                  handleInputChange('taxPaymentPeriod', e.target.value)
                }
              />
            </div>
          </>
        )}

        {selectedType === 'multi_child' && (
          <div className="space-y-2">
            <Label htmlFor="childrenCount">만 19세 미만 자녀 수 (명)</Label>
            <Input
              id="childrenCount"
              type="number"
              placeholder="예: 3"
              value={formData.childrenCount}
              onChange={(e) =>
                handleInputChange('childrenCount', e.target.value)
              }
            />
          </div>
        )}

        {selectedType === 'old_parent' && (
          <div className="space-y-2">
            <Label htmlFor="parentSupportPeriod">노부모 부양기간 (년)</Label>
            <Input
              id="parentSupportPeriod"
              type="number"
              placeholder="예: 5"
              value={formData.parentSupportPeriod}
              onChange={(e) =>
                handleInputChange('parentSupportPeriod', e.target.value)
              }
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>희망 지역</Label>
          <Select
            value={formData.area}
            onValueChange={(value) => handleInputChange('area', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seoul">서울특별시</SelectItem>
              <SelectItem value="gyeonggi">경기도</SelectItem>
              <SelectItem value="incheon">인천광역시</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">청약 계산기</h1>
                <p className="text-sm text-gray-600">
                  청약 유형별 자격 요건과 가점을 정확하게 계산하세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 청약 유형 선택 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span>청약 유형 선택</span>
            </CardTitle>
            <CardDescription>
              신청하고자 하는 청약 유형을 먼저 선택해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(subscriptionTypes).map(([key, type]) => {
                const IconComponent = type.icon;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedType(key)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedType === key
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent
                        className={`h-6 w-6 mt-1 ${
                          selectedType === key
                            ? 'text-blue-600'
                            : 'text-gray-500'
                        }`}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {type.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {type.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          최대 {type.maxScore}점
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 선택된 유형의 상세 정보 */}
        {selectedType && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-green-600" />
                <span>
                  {
                    subscriptionTypes[
                      selectedType as keyof typeof subscriptionTypes
                    ].name
                  }{' '}
                  자격 요건
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {subscriptionTypes[
                  selectedType as keyof typeof subscriptionTypes
                ].requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          {selectedType && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <span>청약 정보 입력</span>
                </CardTitle>
                <CardDescription>
                  선택한 청약 유형에 필요한 정보를 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderFormFields()}

                <Button
                  onClick={calculateScore}
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
                  disabled={
                    !formData.householdPeriod || !formData.subscriptionPeriod
                  }
                >
                  자격 요건 확인 및 가점 계산
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {selectedType && eligibilityResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span>계산 결과</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!eligibilityResult.eligible ? (
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold mb-2">자격 요건 미충족</div>
                      <ul className="space-y-1">
                        {eligibilityResult.reasons.map(
                          (reason: string, index: number) => (
                            <li key={index} className="text-sm">
                              • {reason}
                            </li>
                          )
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {calculatedScore}점
                      </div>
                      <div className="text-green-600 font-semibold mb-2">
                        ✓ 자격 요건 충족
                      </div>
                      <p className="text-gray-600">
                        {calculatedScore && calculatedScore >= 60
                          ? '우수한 가점입니다!'
                          : calculatedScore && calculatedScore >= 45
                          ? '보통 수준의 가점입니다'
                          : '가점 향상이 필요합니다'}
                      </p>
                    </div>

                    {selectedType.includes('general') && calculatedScore && (
                      <>
                        <Separator className="my-4" />
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">무주택 기간</span>
                            <span className="font-semibold">32점</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">부양가족</span>
                            <span className="font-semibold">35점</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              청약통장 가입기간
                            </span>
                            <span className="font-semibold">17점</span>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span>신청 가능한 청약 단지</span>
              </CardTitle>
              <CardDescription>
                현재 조건으로 신청 가능한 단지들입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-green-200 bg-green-50 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {item.name}
                      </h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        신청가능
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {item.location}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">{item.type}</p>
                    <Badge variant="outline" className="text-xs mb-2">
                      {item.subscriptionType}
                    </Badge>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">
                        {item.price}
                      </span>
                      <span className="text-xs text-gray-500">
                        경쟁률 {item.competition}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      최소 가점: {item.minScore}점
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCalculator;
