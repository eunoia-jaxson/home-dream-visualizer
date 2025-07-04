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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
import { createMockLoanProducts } from '@/mocks/loanData';
import type { LoanProduct, SimulationData } from '@/types/loan';
import {
  ArrowLeft,
  PiggyBank,
  TrendingDown,
  AlertCircle,
  Calculator,
  LineChart,
  Percent,
  Home,
  DollarSign,
  Users,
  Shield,
  Info,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// SimulationData 타입은 @/types/loan에서 LoanSimulationData로 사용

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
    repaymentCapacity: '',
  });

  const [simulationSettings, setSimulationSettings] = useState({
    loanAmount: '',
    term: '30',
    rateType: 'variable' as 'fixed' | 'variable' | 'mixed',
    repaymentType: 'equal_payment' as
      | 'equal_payment'
      | 'equal_principal'
      | 'bullet',
    scenario: 'normal' as 'best' | 'normal' | 'worst',
  });

  const [loanResults, setLoanResults] = useState<LoanProduct[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanProduct | null>(null);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(
    null
  );

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

  // DSR/DTI 계산 함수
  const calculateDSR = (
    monthlyIncome: number,
    existingLoan: number,
    newLoanPayment: number
  ) => {
    const monthlyDebt = (existingLoan * 10000) / 12 + newLoanPayment;
    return (monthlyDebt / (monthlyIncome * 10000)) * 100;
  };

  const calculateDTI = (annualIncome: number, loanAmount: number) => {
    const annualInterest = loanAmount * 0.04; // 평균 4% 가정
    return (annualInterest / annualIncome) * 100;
  };

  // 금리 계산 함수
  const calculateFinalRate = (
    baseRate: number,
    formData: {
      jobType: string;
      firstHome: string;
      marriageStatus: string;
      age: string;
      children: string;
    }
  ) => {
    let finalRate = baseRate;

    // 신용도 가산금리 (직업군별)
    if (formData.jobType === 'public') finalRate -= 0.2;
    else if (formData.jobType === 'large_company') finalRate -= 0.1;
    else if (formData.jobType === 'small_business') finalRate += 0.3;
    else if (formData.jobType === 'freelancer') finalRate += 0.5;

    // 생애최초 우대
    if (formData.firstHome === 'yes') finalRate -= 0.2;

    // 신혼부부 우대
    if (formData.marriageStatus === 'married' && parseInt(formData.age) < 40)
      finalRate -= 0.2;

    // 다자녀 우대
    if (parseInt(formData.children) >= 2) finalRate -= 0.3;
    else if (parseInt(formData.children) >= 1) finalRate -= 0.1;

    return Math.max(finalRate, 1.0); // 최저 1% 보장
  };

  // 소득 한도 조회
  const getIncomeLimit = (loanId: string): number | null => {
    const limits: Record<string, number> = {
      stepping_stone: 80000000,
      bogeumjari: 70000000,
      jeonse_loan: 50000000,
      youth_loan: 70000000,
    };
    return limits[loanId] || null;
  };

  // 월 상환액 계산
  const calculateMonthlyPayment = (
    amount: number,
    monthlyRate: number,
    months: number,
    type: string
  ): number => {
    if (monthlyRate === 0) return amount / months;

    switch (type) {
      case 'equal_payment': // 원리금균등상환
        return (
          (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
        );
      case 'equal_principal': // 원금균등상환 (첫 회차)
        return amount / months + amount * monthlyRate;
      case 'bullet': // 만기일시상환
        return amount * monthlyRate;
      default:
        return (
          (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
        );
    }
  };

  const calculateLoan = () => {
    const housePrice = parseInt(formData.housePrice) * 10000 || 0;
    const monthlyIncome = parseInt(formData.monthlyIncome) * 10000 || 0;
    const annualIncome = monthlyIncome * 12;
    const existingLoan = parseInt(formData.existingLoan) * 10000 || 0;
    const age = parseInt(formData.age) || 25;
    const deposit = parseInt(formData.deposit) * 10000 || 0;
    const workExp = parseInt(formData.workExperience) || 0;

    const loanProducts = createMockLoanProducts(housePrice, deposit);

    // 자격 조건 및 대출 한도 계산
    loanProducts.forEach((loan) => {
      // 최종 금리 계산
      loan.finalRate = calculateFinalRate(
        loan.baseRate + loan.additionalRate,
        formData
      );

      // 자격 조건 검증
      let eligible = true;
      let reason = '';

      // 나이 조건
      if (loan.id === 'youth_loan' && age > 34) {
        eligible = false;
        reason = '나이 조건 미충족 (34세 이하)';
      }

      // 소득 조건
      const annualIncomeLimit = getIncomeLimit(loan.id);
      if (annualIncomeLimit && annualIncome > annualIncomeLimit) {
        eligible = false;
        reason = `소득 조건 미충족 (연 ${formatCurrency(
          annualIncomeLimit / 10000
        )} 이하)`;
      }

      // 무주택 조건
      if (
        (loan.id === 'bogeumjari' || loan.id === 'jeonse_loan') &&
        formData.firstHome === 'no'
      ) {
        eligible = false;
        reason = '무주택자 조건 미충족';
      }

      // 신혼부부/다자녀 조건
      if (loan.id === 'stepping_stone') {
        const isMarried = formData.marriageStatus === 'married';
        const hasChildren = parseInt(formData.children) >= 2;
        const isFirstHome = formData.firstHome === 'yes';

        if (!isMarried && !hasChildren) {
          eligible = false;
          reason = '신혼부부 또는 2자녀 이상 조건 미충족';
        }
        if (!isFirstHome) {
          eligible = false;
          reason = '생애최초 주택구입 조건 미충족';
        }
      }

      // DSR/DTI 검증
      if (eligible && loan.maxAmount > 0) {
        const monthlyRate = loan.finalRate / 100 / 12;
        const months = parseInt(simulationSettings.term) * 12;
        const monthlyPayment = calculateMonthlyPayment(
          loan.maxAmount,
          monthlyRate,
          months,
          simulationSettings.repaymentType
        );

        const dsr = calculateDSR(
          monthlyIncome / 10000,
          existingLoan / 10000,
          monthlyPayment
        );
        const dti = calculateDTI(annualIncome, loan.maxAmount);

        if (dsr > loan.maxDSR) {
          eligible = false;
          reason = `DSR 초과 (${dsr.toFixed(1)}% > ${loan.maxDSR}%)`;
        } else if (dti > loan.maxDTI) {
          eligible = false;
          reason = `DTI 초과 (${dti.toFixed(1)}% > ${loan.maxDTI}%)`;
        }

        if (eligible) {
          loan.monthlyPayment = monthlyPayment;
          loan.totalInterest = monthlyPayment * months - loan.maxAmount;
          loan.guaranteeFee = loan.maxAmount * 0.003; // 보증료 0.3% 가정
        }
      }

      loan.eligible = eligible;
      loan.eligibilityReason = reason;
    });

    setLoanResults(loanProducts);
    setShowResults(true);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
                <div className="p-2 bg-purple-600 rounded-lg">
                  <PiggyBank className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    대출 시뮬레이션
                  </h1>
                  <p className="text-sm text-gray-600">
                    정부 대출 상품 조건을 확인하고 상환액을 계산하세요
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
                  <PiggyBank className="h-5 w-5 text-purple-600" />
                  <span>대출 조건 입력</span>
                </CardTitle>
                <CardDescription>
                  대출 시뮬레이션을 위한 정보를 입력해주세요
                </CardDescription>

                {/* 진행률 바 */}
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      입력 진행률
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {/* 격려 메시지 */}
                  <div
                    className={`text-center p-3 rounded-lg bg-gradient-to-r ${
                      progress === 100
                        ? 'from-green-50 to-blue-50 border border-green-200'
                        : 'from-purple-50 to-pink-50 border border-purple-200'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl">
                        {encouragementMessage.icon}
                      </span>
                      <p
                        className={`font-medium ${encouragementMessage.color}`}
                      >
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
                      {formData.housePrice &&
                        formData.deposit &&
                        formData.monthlyIncome &&
                        formData.age &&
                        formData.marriageStatus && (
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
                    <div className="space-y-2">
                      <Label htmlFor="housePrice">주택 가격 (만원)</Label>
                      <Input
                        id="housePrice"
                        type="number"
                        placeholder="예: 30000 (3억원)"
                        value={formData.housePrice}
                        onChange={(e) =>
                          handleInputChange('housePrice', e.target.value)
                        }
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        min="0"
                      />
                      {formData.housePrice && (
                        <p className="text-sm text-green-600 font-medium">
                          🏠 {formatCurrency(formData.housePrice)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deposit">보유 자금 (만원)</Label>
                      <Input
                        id="deposit"
                        type="number"
                        placeholder="예: 10000 (1억원)"
                        value={formData.deposit}
                        onChange={(e) =>
                          handleInputChange('deposit', e.target.value)
                        }
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        min="0"
                      />
                      {formData.deposit && (
                        <p className="text-sm text-blue-600 font-medium">
                          💰 {formatCurrency(formData.deposit)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncome">월 소득 (만원)</Label>
                      <Input
                        id="monthlyIncome"
                        type="number"
                        placeholder="예: 400"
                        value={formData.monthlyIncome}
                        onChange={(e) =>
                          handleInputChange('monthlyIncome', e.target.value)
                        }
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        min="0"
                      />
                      {formData.monthlyIncome && (
                        <p className="text-sm text-purple-600 font-medium">
                          💵 {formatCurrency(formData.monthlyIncome)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="existingLoan">기존 대출 (만원)</Label>
                      <Input
                        id="existingLoan"
                        type="number"
                        placeholder="예: 1000"
                        value={formData.existingLoan}
                        onChange={(e) =>
                          handleInputChange('existingLoan', e.target.value)
                        }
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        min="0"
                      />
                      {formData.existingLoan && (
                        <p className="text-sm text-orange-600 font-medium">
                          💳 {formatCurrency(formData.existingLoan)}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">나이</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="예: 32"
                          value={formData.age}
                          onChange={(e) =>
                            handleInputChange('age', e.target.value)
                          }
                          onKeyDown={handleNumberKeyDown}
                          onPaste={handleNumberPaste}
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>결혼 여부</Label>
                        <Select
                          value={formData.marriageStatus}
                          onValueChange={(value) =>
                            handleInputChange('marriageStatus', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="married">기혼</SelectItem>
                            <SelectItem value="single">미혼</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* 개인 정보 섹션 */}
                <Collapsible
                  open={expandedSections.personal}
                  onOpenChange={() => toggleSection('personal')}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <span>👤 개인 정보</span>
                      {formData.jobType &&
                        formData.workExperience &&
                        formData.children &&
                        formData.houseType &&
                        formData.firstHome &&
                        formData.region && (
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
                        expandedSections.personal ? 'transform rotate-180' : ''
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>대출 목적</Label>
                      <Select
                        value={formData.loanPurpose}
                        onValueChange={(value) =>
                          handleInputChange('loanPurpose', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="purchase">주택 구입</SelectItem>
                          <SelectItem value="jeonse">전세 자금</SelectItem>
                          <SelectItem value="refinance">대환 대출</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>직업군</Label>
                      <Select
                        value={formData.jobType}
                        onValueChange={(value) =>
                          handleInputChange('jobType', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">공무원</SelectItem>
                          <SelectItem value="large_company">대기업</SelectItem>
                          <SelectItem value="employee">일반 직장인</SelectItem>
                          <SelectItem value="small_business">자영업</SelectItem>
                          <SelectItem value="freelancer">프리랜서</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="workExperience">근무 경력 (년)</Label>
                        <Input
                          id="workExperience"
                          type="number"
                          placeholder="예: 5"
                          value={formData.workExperience}
                          onChange={(e) =>
                            handleInputChange('workExperience', e.target.value)
                          }
                          onKeyDown={handleNumberKeyDown}
                          onPaste={handleNumberPaste}
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="children">자녀 수</Label>
                        <Input
                          id="children"
                          type="number"
                          placeholder="예: 1"
                          value={formData.children}
                          onChange={(e) =>
                            handleInputChange('children', e.target.value)
                          }
                          onKeyDown={handleNumberKeyDown}
                          onPaste={handleNumberPaste}
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>주택 유형</Label>
                      <Select
                        value={formData.houseType}
                        onValueChange={(value) =>
                          handleInputChange('houseType', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">아파트</SelectItem>
                          <SelectItem value="villa">빌라/연립</SelectItem>
                          <SelectItem value="house">단독주택</SelectItem>
                          <SelectItem value="officetel">오피스텔</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>주택 소유 경험</Label>
                      <Select
                        value={formData.firstHome}
                        onValueChange={(value) =>
                          handleInputChange('firstHome', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">생애최초 (무주택)</SelectItem>
                          <SelectItem value="no">
                            주택 소유 경험 있음
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>지역</Label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) =>
                          handleInputChange('region', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="서울">서울특별시</SelectItem>
                          <SelectItem value="경기">경기도</SelectItem>
                          <SelectItem value="인천">인천광역시</SelectItem>
                          <SelectItem value="부산">부산광역시</SelectItem>
                          <SelectItem value="대구">대구광역시</SelectItem>
                          <SelectItem value="기타">기타 지역</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* 시뮬레이션 설정 섹션 */}
                <Collapsible
                  open={expandedSections.financial}
                  onOpenChange={() => toggleSection('financial')}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <span>⚙️ 시뮬레이션 설정</span>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-700"
                      >
                        선택사항
                      </Badge>
                    </h4>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        expandedSections.financial ? 'transform rotate-180' : ''
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>대출 기간</Label>
                        <Select
                          value={simulationSettings.term}
                          onValueChange={(value) =>
                            handleSimulationChange('term', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10년</SelectItem>
                            <SelectItem value="15">15년</SelectItem>
                            <SelectItem value="20">20년</SelectItem>
                            <SelectItem value="25">25년</SelectItem>
                            <SelectItem value="30">30년</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>금리 유형</Label>
                        <Select
                          value={simulationSettings.rateType}
                          onValueChange={(value) =>
                            handleSimulationChange('rateType', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">고정금리</SelectItem>
                            <SelectItem value="variable">변동금리</SelectItem>
                            <SelectItem value="mixed">혼합금리</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>상환 방식</Label>
                      <Select
                        value={simulationSettings.repaymentType}
                        onValueChange={(value) =>
                          handleSimulationChange('repaymentType', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equal_payment">
                            원리금균등상환
                          </SelectItem>
                          <SelectItem value="equal_principal">
                            원금균등상환
                          </SelectItem>
                          <SelectItem value="bullet">만기일시상환</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Button
                  onClick={calculateLoan}
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingDown className="h-5 w-5 text-green-600" />
                      <span>대출 상품 비교</span>
                    </CardTitle>
                    <CardDescription>
                      조건에 맞는 대출 상품들 (
                      {loanResults.filter((l) => l.eligible).length}개 이용가능)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loanResults.map((loan, index) => (
                      <div
                        key={index}
                        className={`p-6 border rounded-lg transition-all cursor-pointer ${
                          loan.eligible
                            ? 'border-green-200 bg-green-50 hover:border-green-300'
                            : 'border-gray-200 bg-gray-50 opacity-60'
                        } ${
                          selectedLoan?.id === loan.id
                            ? 'ring-2 ring-purple-500'
                            : ''
                        }`}
                        onClick={() => loan.eligible && setSelectedLoan(loan)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {loan.name}
                            </h4>
                            <p className="text-sm text-gray-600">{loan.type}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                variant={
                                  loan.category === 'government'
                                    ? 'default'
                                    : loan.category === 'policy'
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {loan.category === 'government'
                                  ? '정부지원'
                                  : loan.category === 'policy'
                                  ? '정책대출'
                                  : '시중은행'}
                              </Badge>
                            </div>
                          </div>
                          {loan.eligible ? (
                            <div className="text-right">
                              <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                                이용가능
                              </span>
                              <div className="mt-2">
                                <span className="text-2xl font-bold text-purple-600">
                                  {loan.finalRate.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full">
                              조건미달
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-500">
                              최대 대출액
                            </span>
                            <div className="font-semibold text-lg">
                              {formatCurrency(loan.maxAmount / 10000)}
                            </div>
                          </div>
                          {loan.eligible && loan.monthlyPayment > 0 && (
                            <div>
                              <span className="text-sm text-gray-500">
                                월 상환액
                              </span>
                              <div className="font-bold text-lg text-blue-600">
                                {formatCurrency(
                                  Math.round(loan.monthlyPayment / 10000)
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {loan.eligible && (
                          <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                            <div>
                              <Tooltip>
                                <TooltipTrigger className="flex items-center">
                                  <span className="text-gray-500 underline-offset-2 decoration-dotted underline cursor-help">
                                    LTV
                                  </span>
                                  <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-semibold">
                                    LTV (Loan To Value)
                                  </p>
                                  <p>
                                    담보인정비율: 주택가격 대비 대출가능 비율
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    예: LTV 70% → 3억원 집에 최대 2.1억원 대출
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                              <div className="font-medium">{loan.maxLTV}%</div>
                            </div>
                            <div>
                              <Tooltip>
                                <TooltipTrigger className="flex items-center">
                                  <span className="text-gray-500 underline-offset-2 decoration-dotted underline cursor-help">
                                    DTI
                                  </span>
                                  <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-semibold">
                                    DTI (Debt To Income)
                                  </p>
                                  <p>
                                    총부채상환비율: 연소득 대비 연간 대출이자
                                    비율
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    예: 연소득 6천만원, DTI 50% → 연 이자
                                    3천만원 한도
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                              <div className="font-medium">{loan.maxDTI}%</div>
                            </div>
                            <div>
                              <Tooltip>
                                <TooltipTrigger className="flex items-center">
                                  <span className="text-gray-500 underline-offset-2 decoration-dotted underline cursor-help">
                                    DSR
                                  </span>
                                  <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-semibold">
                                    DSR (Debt Service Ratio)
                                  </p>
                                  <p>
                                    총부채원리금상환비율: 연소득 대비 모든 대출
                                    원리금 비율
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    예: 연소득 6천만원, DSR 40% → 연 원리금
                                    2.4천만원 한도
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                              <div className="font-medium">{loan.maxDSR}%</div>
                            </div>
                          </div>
                        )}

                        <Separator className="my-4" />

                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600">
                            {loan.eligible
                              ? `혜택: ${loan.benefits.join(', ')}`
                              : loan.eligibilityReason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* 상세 시뮬레이션 */}
                {selectedLoan && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <LineChart className="h-5 w-5 text-blue-600" />
                        <span>{selectedLoan.name} 상세 시뮬레이션</span>
                      </CardTitle>
                      <CardDescription>
                        선택한 대출 상품의 상세 조건 및 상환 계획
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="summary" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="summary">요약</TabsTrigger>
                          <TabsTrigger value="conditions">조건</TabsTrigger>
                          <TabsTrigger value="schedule">상환계획</TabsTrigger>
                        </TabsList>

                        <TabsContent value="summary" className="space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <DollarSign className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                  대출액
                                </span>
                              </div>
                              <div className="text-xl font-bold text-blue-900">
                                {formatCurrency(selectedLoan.maxAmount / 10000)}
                              </div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Percent className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-900">
                                  적용금리
                                </span>
                              </div>
                              <div className="text-xl font-bold text-purple-900">
                                {selectedLoan.finalRate.toFixed(2)}%
                              </div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Home className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-900">
                                  월 상환액
                                </span>
                              </div>
                              <div className="text-xl font-bold text-green-900">
                                {formatCurrency(
                                  Math.round(
                                    selectedLoan.monthlyPayment / 10000
                                  )
                                )}
                              </div>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <TrendingDown className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-900">
                                  총 이자
                                </span>
                              </div>
                              <div className="text-xl font-bold text-orange-900">
                                {formatCurrency(
                                  Math.round(selectedLoan.totalInterest / 10000)
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">
                              금리 구성
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  기준금리
                                </span>
                                <span className="font-medium">
                                  {selectedLoan.baseRate.toFixed(2)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  가산금리
                                </span>
                                <span className="font-medium">
                                  {selectedLoan.additionalRate >= 0 ? '+' : ''}
                                  {selectedLoan.additionalRate.toFixed(2)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  우대금리
                                </span>
                                <span className="font-medium text-green-600">
                                  -
                                  {(
                                    selectedLoan.baseRate +
                                    selectedLoan.additionalRate -
                                    selectedLoan.finalRate
                                  ).toFixed(2)}
                                  %
                                </span>
                              </div>
                              <Separator />
                              <div className="flex justify-between font-semibold">
                                <span>최종 적용금리</span>
                                <span className="text-purple-600">
                                  {selectedLoan.finalRate.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="conditions" className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Shield className="h-4 w-4 mr-2" />
                                자격 조건
                              </h4>
                              <ul className="space-y-2">
                                {selectedLoan.conditions.map(
                                  (condition, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-gray-600 flex items-start"
                                    >
                                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                      {condition}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                혜택
                              </h4>
                              <ul className="space-y-2">
                                {selectedLoan.benefits.map((benefit, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-green-600 flex items-start"
                                  >
                                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                제한사항
                              </h4>
                              <ul className="space-y-2">
                                {selectedLoan.restrictions.map(
                                  (restriction, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-orange-600 flex items-start"
                                    >
                                      <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                      {restriction}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="schedule" className="space-y-6">
                          <div className="text-center text-gray-600">
                            <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <h4 className="font-semibold mb-2">
                              상세 상환 계획
                            </h4>
                            <p className="text-sm">
                              월별 상환 스케줄과 이자/원금 비율 분석을
                              제공합니다.
                            </p>
                            <Button
                              className="mt-4"
                              onClick={() => {
                                // 상환 스케줄 생성 로직 (추후 구현)
                                alert(
                                  '상세 상환 계획 기능은 곧 추가될 예정입니다.'
                                );
                              }}
                            >
                              상세 분석 보기
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Additional Info */}
          {showResults && (
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
                        • <strong>일반지역:</strong> 40% 이하 (연소득 1억원 초과
                        시 35%)
                      </p>
                      <p>
                        • <strong>투기과열지구:</strong> 30% 이하
                      </p>
                      <p>
                        • <strong>예시:</strong> 연소득 6천만원 → DSR 40% 기준
                        월 상환액 200만원 한도
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
                        • <strong>예시:</strong> 연소득 6천만원 → DTI 50% 기준
                        연간 이자 3천만원 한도
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
                      <h4 className="font-semibold text-gray-900">
                        생애최초 우대
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex justify-between">
                          <span>금리 우대:</span>
                          <span className="font-medium text-green-600">
                            -0.2%p
                          </span>
                        </p>
                        <p>• 무주택자 대상</p>
                        <p>• 실거주 목적 한정</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">
                        신혼부부 우대
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex justify-between">
                          <span>금리 우대:</span>
                          <span className="font-medium text-green-600">
                            -0.2%p
                          </span>
                        </p>
                        <p>• 결혼 7년 이내</p>
                        <p>• 부부 합산 연령 70세 이하</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">
                        다자녀 우대
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex justify-between">
                          <span>2자녀 이상:</span>
                          <span className="font-medium text-green-600">
                            -0.3%p
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>1자녀:</span>
                          <span className="font-medium text-green-600">
                            -0.1%p
                          </span>
                        </p>
                        <p>• 만 18세 이하 자녀</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LoanSimulation;
