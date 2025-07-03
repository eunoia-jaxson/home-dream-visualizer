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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  TrendingUp,
  Home,
  Calculator,
  PieChart,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
} from 'recharts';

// 타입 정의
interface SimulationData {
  year: string;
  assets: number;
  savings: number;
  totalIncome: number;
  totalExpense: number;
  netWorth: number;
  canBuyWorst: boolean;
  canBuyAverage: boolean;
  canBuyBest: boolean;
}

interface ScenarioConfig {
  incomeGrowthRate: number;
  expenseGrowthRate: number;
  investmentReturn: number;
  inflationRate: number;
  name: string;
  color: string;
}

interface ScenarioData {
  assets: number;
  income: number;
  expense: number;
  savings: number;
  canBuy: boolean;
}

const AssetSimulation = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpense: '',
    currentAssets: '',
    targetAmount: '',
    incomeGrowthRate: '3', // 연간 수입 증가율
    expenseGrowthRate: '2', // 연간 지출 증가율
    investmentReturn: '5', // 투자 수익률
    targetHousePrice: '50000', // 목표 주택 가격 (만원)
    // 커스텀 입력 필드 추가
    customIncomeGrowthRate: '',
    customExpenseGrowthRate: '',
    customInvestmentReturn: '',
  });

  const [simulationData, setSimulationData] = useState<SimulationData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('average');

  // 시나리오 설정
  const scenarios: Record<string, ScenarioConfig> = {
    worst: {
      incomeGrowthRate: 1,
      expenseGrowthRate: 4,
      investmentReturn: 2,
      inflationRate: 4,
      name: '최악의 시나리오',
      color: '#ef4444',
    },
    average: {
      incomeGrowthRate: 3,
      expenseGrowthRate: 2.5,
      investmentReturn: 5,
      inflationRate: 2.5,
      name: '평균 시나리오',
      color: '#3b82f6',
    },
    best: {
      incomeGrowthRate: 5,
      expenseGrowthRate: 1.5,
      investmentReturn: 8,
      inflationRate: 2,
      name: '최선의 시나리오',
      color: '#10b981',
    },
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 만원 단위를 읽기 쉬운 형태로 변환하는 함수
  const formatCurrency = (amount: string) => {
    const num = parseInt(amount);
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

  const generateDetailedSimulation = () => {
    const income = parseInt(formData.monthlyIncome) || 0;
    const expense = parseInt(formData.monthlyExpense) || 0;
    const currentAssets = parseInt(formData.currentAssets) || 0;
    const targetHousePrice = parseInt(formData.targetHousePrice) || 50000;

    // 커스텀 값이 있으면 사용, 없으면 기본 값 사용
    const userIncomeGrowthRate =
      formData.incomeGrowthRate === 'custom'
        ? parseFloat(formData.customIncomeGrowthRate) || 3
        : parseFloat(formData.incomeGrowthRate) || 3;

    const userExpenseGrowthRate =
      formData.expenseGrowthRate === 'custom'
        ? parseFloat(formData.customExpenseGrowthRate) || 2
        : parseFloat(formData.expenseGrowthRate) || 2;

    const userInvestmentReturn =
      formData.investmentReturn === 'custom'
        ? parseFloat(formData.customInvestmentReturn) || 5
        : parseFloat(formData.investmentReturn) || 5;

    const data: SimulationData[] = [];

    for (let year = 0; year <= 15; year++) {
      // 각 시나리오별 계산
      const scenarios_data: Record<string, ScenarioData> = {};

      Object.entries(scenarios).forEach(([key, scenario]) => {
        // 사용자 설정값을 기준으로 시나리오 조정
        let yearlyIncomeGrowth = userIncomeGrowthRate / 100;
        let yearlyExpenseGrowth = userExpenseGrowthRate / 100;
        let yearlyReturn = userInvestmentReturn / 100;

        // 시나리오별 조정 (사용자 기본값 기준으로 상대적 조정)
        if (key === 'worst') {
          yearlyIncomeGrowth = Math.max(0, yearlyIncomeGrowth - 0.02); // 2%p 감소
          yearlyExpenseGrowth = yearlyExpenseGrowth + 0.015; // 1.5%p 증가
          yearlyReturn = Math.max(0.01, yearlyReturn - 0.03); // 3%p 감소 (최소 1%)
        } else if (key === 'best') {
          yearlyIncomeGrowth = yearlyIncomeGrowth + 0.02; // 2%p 증가
          yearlyExpenseGrowth = Math.max(0.005, yearlyExpenseGrowth - 0.005); // 0.5%p 감소
          yearlyReturn = yearlyReturn + 0.03; // 3%p 증가
        }
        // average는 사용자 설정값 그대로 사용

        // 해당 연도의 월 수입/지출
        const currentIncome = income * Math.pow(1 + yearlyIncomeGrowth, year);
        const currentExpense =
          expense * Math.pow(1 + yearlyExpenseGrowth, year);
        const monthlySavings = currentIncome - currentExpense;

        // 자산 계산 (복리 적용)
        let totalAssets = currentAssets * 10000; // 만원을 원 단위로

        if (year > 0) {
          // 기존 자산의 투자 수익
          totalAssets =
            currentAssets * 10000 * Math.pow(1 + yearlyReturn, year);

          // 매년 추가되는 저축액 (복리 적용)
          for (let i = 1; i <= year; i++) {
            const yearIncome = income * Math.pow(1 + yearlyIncomeGrowth, i);
            const yearExpense = expense * Math.pow(1 + yearlyExpenseGrowth, i);
            const yearSavings = (yearIncome - yearExpense) * 12 * 10000;

            if (yearSavings > 0) {
              totalAssets += yearSavings * Math.pow(1 + yearlyReturn, year - i);
            }
          }
        }

        scenarios_data[key] = {
          assets: Math.round(totalAssets / 10000),
          income: Math.round(currentIncome),
          expense: Math.round(currentExpense),
          savings: Math.round(monthlySavings),
          canBuy: totalAssets >= targetHousePrice * 10000,
        };
      });

      data.push({
        year: year === 0 ? '현재' : `${year}년`,
        assets: scenarios_data.average.assets,
        savings: scenarios_data.average.savings,
        totalIncome: scenarios_data.average.income * 12,
        totalExpense: scenarios_data.average.expense * 12,
        netWorth: scenarios_data.average.assets,
        canBuyWorst: scenarios_data.worst.canBuy,
        canBuyAverage: scenarios_data.average.canBuy,
        canBuyBest: scenarios_data.best.canBuy,
      });
    }

    setSimulationData(data);
    setShowResults(true);
  };

  const getScenarioData = (scenario: string) => {
    const config = scenarios[scenario];
    const income = parseInt(formData.monthlyIncome) || 0;
    const expense = parseInt(formData.monthlyExpense) || 0;
    const currentAssets = parseInt(formData.currentAssets) || 0;

    // 커스텀 값이 있으면 사용, 없으면 기본 값 사용
    const userIncomeGrowthRate =
      formData.incomeGrowthRate === 'custom'
        ? parseFloat(formData.customIncomeGrowthRate) || 3
        : parseFloat(formData.incomeGrowthRate) || 3;

    const userExpenseGrowthRate =
      formData.expenseGrowthRate === 'custom'
        ? parseFloat(formData.customExpenseGrowthRate) || 2
        : parseFloat(formData.expenseGrowthRate) || 2;

    const userInvestmentReturn =
      formData.investmentReturn === 'custom'
        ? parseFloat(formData.customInvestmentReturn) || 5
        : parseFloat(formData.investmentReturn) || 5;

    return simulationData.map((item, index) => {
      const year = index;

      // 사용자 설정값을 기준으로 시나리오 조정
      let yearlyIncomeGrowth = userIncomeGrowthRate / 100;
      let yearlyExpenseGrowth = userExpenseGrowthRate / 100;
      let yearlyReturn = userInvestmentReturn / 100;

      // 시나리오별 조정
      if (scenario === 'worst') {
        yearlyIncomeGrowth = Math.max(0, yearlyIncomeGrowth - 0.02);
        yearlyExpenseGrowth = yearlyExpenseGrowth + 0.015;
        yearlyReturn = Math.max(0.01, yearlyReturn - 0.03);
      } else if (scenario === 'best') {
        yearlyIncomeGrowth = yearlyIncomeGrowth + 0.02;
        yearlyExpenseGrowth = Math.max(0.005, yearlyExpenseGrowth - 0.005);
        yearlyReturn = yearlyReturn + 0.03;
      }

      const currentIncome = income * Math.pow(1 + yearlyIncomeGrowth, year);
      const currentExpense = expense * Math.pow(1 + yearlyExpenseGrowth, year);

      let totalAssets = currentAssets * 10000;

      if (year > 0) {
        totalAssets = currentAssets * 10000 * Math.pow(1 + yearlyReturn, year);

        for (let i = 1; i <= year; i++) {
          const yearIncome = income * Math.pow(1 + yearlyIncomeGrowth, i);
          const yearExpense = expense * Math.pow(1 + yearlyExpenseGrowth, i);
          const yearSavings = (yearIncome - yearExpense) * 12 * 10000;

          if (yearSavings > 0) {
            totalAssets += yearSavings * Math.pow(1 + yearlyReturn, year - i);
          }
        }
      }

      return {
        ...item,
        assets: Math.round(totalAssets / 10000),
        income: Math.round(currentIncome),
        expense: Math.round(currentExpense),
        savings: Math.round(currentIncome - currentExpense),
      };
    });
  };

  const getTargetAchievementYear = (scenario: string) => {
    const targetPrice = parseInt(formData.targetHousePrice) || 50000;
    const data = getScenarioData(scenario);
    const achievementYear = data.findIndex(
      (item) => item.assets >= targetPrice
    );
    return achievementYear === -1 ? null : achievementYear;
  };

  const getAssetBreakdown = () => {
    if (!showResults || simulationData.length === 0) return [];

    const currentSavings =
      simulationData[simulationData.length - 1]?.savings || 0;
    const currentAssets = parseInt(formData.currentAssets) || 0;
    const investmentGains =
      simulationData[simulationData.length - 1]?.assets -
      currentAssets -
      currentSavings * 15 * 12;

    return [
      { name: '기존 자산', value: currentAssets, fill: '#3b82f6' },
      { name: '저축 누적', value: currentSavings * 15 * 12, fill: '#10b981' },
      {
        name: '투자 수익',
        value: Math.max(0, investmentGains),
        fill: '#f59e0b',
      },
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
              <div className="p-2 bg-green-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  스마트 자산 성장 시뮬레이션
                </h1>
                <p className="text-sm text-gray-600">
                  다양한 시나리오로 미래 자산을 정밀 예측해보세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-green-600" />
                <span>시뮬레이션 설정</span>
              </CardTitle>
              <CardDescription>
                현재 상황과 미래 변화 전망을 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">기본 정보</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">월 수입 (만원)</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      placeholder="예: 350"
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
                    <Label htmlFor="monthlyExpense">월 지출 (만원)</Label>
                    <Input
                      id="monthlyExpense"
                      type="number"
                      placeholder="예: 200"
                      value={formData.monthlyExpense}
                      onChange={(e) =>
                        handleInputChange('monthlyExpense', e.target.value)
                      }
                    />
                    {formData.monthlyExpense && (
                      <p className="text-sm text-red-600 font-medium">
                        💸 {formatCurrency(formData.monthlyExpense)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentAssets">현재 자산 (만원)</Label>
                  <Input
                    id="currentAssets"
                    type="number"
                    placeholder="예: 3000"
                    value={formData.currentAssets}
                    onChange={(e) =>
                      handleInputChange('currentAssets', e.target.value)
                    }
                  />
                  {formData.currentAssets && (
                    <p className="text-sm text-blue-600 font-medium">
                      💰 {formatCurrency(formData.currentAssets)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetHousePrice">
                    목표 주택 가격 (만원)
                  </Label>
                  <Input
                    id="targetHousePrice"
                    type="number"
                    placeholder="예: 50000"
                    value={formData.targetHousePrice}
                    onChange={(e) =>
                      handleInputChange('targetHousePrice', e.target.value)
                    }
                  />
                  {formData.targetHousePrice && (
                    <p className="text-sm text-green-600 font-medium">
                      🏠 {formatCurrency(formData.targetHousePrice)}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* 미래 전망 설정 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">
                    미래 전망 설정
                  </h4>
                  {(formData.incomeGrowthRate === 'custom' ||
                    formData.expenseGrowthRate === 'custom' ||
                    formData.investmentReturn === 'custom') && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-700"
                    >
                      🎯 사용자 정의 설정
                    </Badge>
                  )}
                </div>
                {(formData.incomeGrowthRate === 'custom' ||
                  formData.expenseGrowthRate === 'custom' ||
                  formData.investmentReturn === 'custom') && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <div className="font-medium">💡 고급 설정 활성화</div>
                      <div className="text-sm mt-1">
                        사용자 정의 값을 설정하셨습니다. 시나리오 분석 시 이
                        값들을 기준으로 상대적 변화를 적용합니다.
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="incomeGrowthRate">
                      연간 수입 증가율 (%)
                    </Label>
                    <Select
                      value={formData.incomeGrowthRate}
                      onValueChange={(value) =>
                        handleInputChange('incomeGrowthRate', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0% (변화없음)</SelectItem>
                        <SelectItem value="1">1% (보수적)</SelectItem>
                        <SelectItem value="2">2% (안정적)</SelectItem>
                        <SelectItem value="3">3% (평균적)</SelectItem>
                        <SelectItem value="4">4% (적극적)</SelectItem>
                        <SelectItem value="5">5% (낙관적)</SelectItem>
                        <SelectItem value="custom">🎯 직접 입력</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.incomeGrowthRate === 'custom' && (
                      <Input
                        type="number"
                        placeholder="예: 8 (고소득자/승진 예상)"
                        value={formData.customIncomeGrowthRate}
                        onChange={(e) =>
                          handleInputChange(
                            'customIncomeGrowthRate',
                            e.target.value
                          )
                        }
                        className="mt-2"
                        min="0"
                        max="50"
                        step="0.1"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expenseGrowthRate">
                      연간 지출 증가율 (%)
                    </Label>
                    <Select
                      value={formData.expenseGrowthRate}
                      onValueChange={(value) =>
                        handleInputChange('expenseGrowthRate', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1% (절약형)</SelectItem>
                        <SelectItem value="1.5">1.5% (관리형)</SelectItem>
                        <SelectItem value="2">2% (평균형)</SelectItem>
                        <SelectItem value="2.5">2.5% (일반형)</SelectItem>
                        <SelectItem value="3">3% (소비형)</SelectItem>
                        <SelectItem value="4">4% (인플레이션)</SelectItem>
                        <SelectItem value="custom">🎯 직접 입력</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.expenseGrowthRate === 'custom' && (
                      <Input
                        type="number"
                        placeholder="예: 0.5 (초절약형)"
                        value={formData.customExpenseGrowthRate}
                        onChange={(e) =>
                          handleInputChange(
                            'customExpenseGrowthRate',
                            e.target.value
                          )
                        }
                        className="mt-2"
                        min="0"
                        max="20"
                        step="0.1"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investmentReturn">예상 투자 수익률 (%)</Label>
                  <Select
                    value={formData.investmentReturn}
                    onValueChange={(value) =>
                      handleInputChange('investmentReturn', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2% (예금/적금)</SelectItem>
                      <SelectItem value="3">3% (국고채)</SelectItem>
                      <SelectItem value="4">4% (회사채)</SelectItem>
                      <SelectItem value="5">5% (혼합형 펀드)</SelectItem>
                      <SelectItem value="6">6% (주식형 펀드)</SelectItem>
                      <SelectItem value="7">7% (직접 투자)</SelectItem>
                      <SelectItem value="8">8% (적극적 투자)</SelectItem>
                      <SelectItem value="custom">🎯 직접 입력</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.investmentReturn === 'custom' && (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="예: 12 (부동산/주식 고수익)"
                        value={formData.customInvestmentReturn}
                        onChange={(e) =>
                          handleInputChange(
                            'customInvestmentReturn',
                            e.target.value
                          )
                        }
                        className="mt-2"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <p className="text-xs text-gray-500">
                        💡 참고: 암호화폐(15-30%), 성장주(10-15%), 부동산(8-12%)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  현재 월 저축액
                </h4>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-green-600">
                    {formData.monthlyIncome && formData.monthlyExpense
                      ? `${
                          parseInt(formData.monthlyIncome) -
                          parseInt(formData.monthlyExpense)
                        }만원`
                      : '0만원'}
                  </p>
                  {formData.monthlyIncome &&
                    formData.monthlyExpense &&
                    parseInt(formData.monthlyIncome) -
                      parseInt(formData.monthlyExpense) >
                      0 && (
                      <p className="text-sm text-green-700">
                        💵 월 저축:{' '}
                        {formatCurrency(
                          String(
                            parseInt(formData.monthlyIncome) -
                              parseInt(formData.monthlyExpense)
                          )
                        )}{' '}
                        <br />
                        📈 연간 저축:{' '}
                        {formatCurrency(
                          String(
                            (parseInt(formData.monthlyIncome) -
                              parseInt(formData.monthlyExpense)) *
                              12
                          )
                        )}
                      </p>
                    )}
                  {formData.monthlyIncome &&
                    formData.monthlyExpense &&
                    parseInt(formData.monthlyIncome) -
                      parseInt(formData.monthlyExpense) <=
                      0 && (
                      <p className="text-sm text-red-600">
                        ⚠️ 지출이 수입보다 많습니다. 가계부를 다시 확인해주세요.
                      </p>
                    )}
                </div>
              </div>

              <Button
                onClick={generateDetailedSimulation}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!formData.monthlyIncome || !formData.monthlyExpense}
              >
                정밀 시뮬레이션 실행
              </Button>
            </CardContent>
          </Card>

          {/* Results Overview */}
          {showResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>목표 달성 전망</span>
                </CardTitle>
                <CardDescription>
                  시나리오별 주택 구매 가능 시점
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(scenarios).map(([key, scenario]) => {
                  const achievementYear = getTargetAchievementYear(key);

                  // 사용자 커스텀 값 반영
                  const userIncomeGrowthRate =
                    formData.incomeGrowthRate === 'custom'
                      ? parseFloat(formData.customIncomeGrowthRate) || 3
                      : parseFloat(formData.incomeGrowthRate) || 3;

                  const userExpenseGrowthRate =
                    formData.expenseGrowthRate === 'custom'
                      ? parseFloat(formData.customExpenseGrowthRate) || 2
                      : parseFloat(formData.expenseGrowthRate) || 2;

                  const userInvestmentReturn =
                    formData.investmentReturn === 'custom'
                      ? parseFloat(formData.customInvestmentReturn) || 5
                      : parseFloat(formData.investmentReturn) || 5;

                  // 시나리오별 실제 적용값 계산
                  let actualIncomeGrowth = userIncomeGrowthRate;
                  let actualExpenseGrowth = userExpenseGrowthRate;
                  let actualInvestmentReturn = userInvestmentReturn;

                  if (key === 'worst') {
                    actualIncomeGrowth = Math.max(0, userIncomeGrowthRate - 2);
                    actualExpenseGrowth = userExpenseGrowthRate + 1.5;
                    actualInvestmentReturn = Math.max(
                      1,
                      userInvestmentReturn - 3
                    );
                  } else if (key === 'best') {
                    actualIncomeGrowth = userIncomeGrowthRate + 2;
                    actualExpenseGrowth = Math.max(
                      0.5,
                      userExpenseGrowthRate - 0.5
                    );
                    actualInvestmentReturn = userInvestmentReturn + 3;
                  }

                  return (
                    <div
                      key={key}
                      className="p-4 border rounded-lg"
                      style={{
                        borderColor: scenario.color + '40',
                        backgroundColor: scenario.color + '10',
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className="font-semibold"
                          style={{ color: scenario.color }}
                        >
                          {scenario.name}
                        </h4>
                        {achievementYear !== null ? (
                          <Badge variant="secondary" className="text-xs">
                            {achievementYear}년 후 달성
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            15년+ 소요
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">수입 증가:</span>
                          <span className="font-semibold ml-2">
                            {actualIncomeGrowth.toFixed(1)}%/년
                          </span>
                          {formData.incomeGrowthRate === 'custom' && (
                            <span className="text-xs text-blue-600 ml-1">
                              (사용자 설정)
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-600">지출 증가:</span>
                          <span className="font-semibold ml-2">
                            {actualExpenseGrowth.toFixed(1)}%/년
                          </span>
                          {formData.expenseGrowthRate === 'custom' && (
                            <span className="text-xs text-blue-600 ml-1">
                              (사용자 설정)
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-600">투자 수익:</span>
                          <span className="font-semibold ml-2">
                            {actualInvestmentReturn.toFixed(1)}%/년
                          </span>
                          {formData.investmentReturn === 'custom' && (
                            <span className="text-xs text-blue-600 ml-1">
                              (사용자 설정)
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-600">시나리오:</span>
                          <span className="font-semibold ml-2">
                            {key === 'worst'
                              ? '보수적'
                              : key === 'best'
                              ? '낙관적'
                              : '기준값'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 구체적인 실천 방법 추천 */}
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold mb-2">
                        💡 목표 달성 가속화 방법
                      </div>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • 월 지출을 10% 줄이면 목표 달성이{' '}
                          <span className="font-semibold text-green-600">
                            2-3년
                          </span>{' '}
                          단축됩니다
                        </li>
                        <li>
                          • 투자 수익률을 1% 향상시키면{' '}
                          <span className="font-semibold text-blue-600">
                            15년 후 자산이 20% 증가
                          </span>
                          합니다
                        </li>
                        <li>
                          • 부업으로 월 50만원 추가 수입 시 목표 달성이{' '}
                          <span className="font-semibold text-purple-600">
                            40% 빨라집니다
                          </span>
                        </li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  {/* 구체적인 절약 방법들 */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-800 text-sm">
                        💰 월 지출 절약 실천법 (구체적 방법)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(() => {
                        const currentExpense =
                          parseInt(formData.monthlyExpense) || 200;
                        const savingsMethods = [
                          {
                            icon: '☕',
                            title: '커피 할인 혜택 활용',
                            description: '개인컵 지참 시 300원 할인',
                            frequency: '주 15회',
                            savings: 300 * 15 * 4, // 월 18,000원
                            detail: '300원 × 15회 × 4주',
                          },
                          {
                            icon: '🚌',
                            title: '교통비 최적화',
                            description: '정기권/통합이용권 활용',
                            frequency: '월 고정',
                            savings: 30000, // 월 30,000원
                            detail: '일반요금 대비 30% 절약',
                          },
                          {
                            icon: '📱',
                            title: '구독 서비스 정리',
                            description: '미사용 구독 서비스 해지',
                            frequency: '월 고정',
                            savings: 25000, // 월 25,000원
                            detail: 'OTT/음악/게임 등 중복 해지',
                          },
                          {
                            icon: '🍱',
                            title: '점심 도시락 준비',
                            description: '주 3회 도시락 vs 외식',
                            frequency: '주 3회',
                            savings: (12000 - 3000) * 3 * 4, // 월 108,000원
                            detail: '12,000원 → 3,000원 (9,000원 절약 × 12회)',
                          },
                          {
                            icon: '🏠',
                            title: '홈카페/홈쿡 늘리기',
                            description: '외식을 집에서 해결',
                            frequency: '주 2회',
                            savings: (35000 - 10000) * 2 * 4, // 월 200,000원
                            detail: '35,000원 → 10,000원 (25,000원 절약 × 8회)',
                          },
                        ];

                        return savingsMethods.map((method, index) => {
                          const percentage = (
                            (method.savings / 10000 / currentExpense) *
                            100
                          ).toFixed(1);
                          return (
                            <div
                              key={index}
                              className="flex items-start justify-between p-3 bg-white rounded-lg border border-blue-100"
                            >
                              <div className="flex items-start space-x-3">
                                <span className="text-2xl">{method.icon}</span>
                                <div>
                                  <h5 className="font-semibold text-gray-900 text-sm">
                                    {method.title}
                                  </h5>
                                  <p className="text-xs text-gray-600 mb-1">
                                    {method.description}
                                  </p>
                                  <p className="text-xs text-blue-600">
                                    {method.detail}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-green-600">
                                  {formatCurrency(
                                    String(method.savings / 10000)
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  월 지출의 {percentage}%
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}

                      <div className="mt-4 p-3 bg-green-100 rounded-lg">
                        <div className="text-sm font-semibold text-green-800">
                          💡 모든 방법 실천 시 월 절약액
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {(() => {
                            const totalSavings =
                              (18000 + 30000 + 25000 + 108000 + 200000) / 10000;
                            const currentExpense =
                              parseInt(formData.monthlyExpense) || 200;
                            const percentage = (
                              (totalSavings / currentExpense) *
                              100
                            ).toFixed(1);
                            return `${formatCurrency(
                              String(totalSavings)
                            )} (${percentage}% 절약)`;
                          })()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 구체적인 투자 수익률 향상 방법들 */}
                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-purple-800 text-sm">
                        📈 투자 수익률 향상 실천법
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(() => {
                        const currentReturn = parseFloat(
                          formData.investmentReturn === 'custom'
                            ? formData.customInvestmentReturn || '5'
                            : formData.investmentReturn || '5'
                        );

                        const investmentMethods = [
                          {
                            icon: '🏦',
                            title: '적금 → 인덱스 펀드 전환',
                            current: '2-3%',
                            target: '5-7%',
                            improvement: 3,
                            description: '안전하면서도 수익률 향상',
                          },
                          {
                            icon: '📊',
                            title: '포트폴리오 분산 투자',
                            current: currentReturn + '%',
                            target: currentReturn + 1.5 + '%',
                            improvement: 1.5,
                            description: '국내외 주식/채권 분산',
                          },
                          {
                            icon: '💎',
                            title: '정기 적립 투자 (DCA)',
                            current: '변동성 높음',
                            target: '리스크 감소',
                            improvement: 1,
                            description: '시장 타이밍 리스크 줄이기',
                          },
                          {
                            icon: '🎯',
                            title: 'ISA/IRP 세제혜택 활용',
                            current: '일반 투자',
                            target: '세후 수익률 +1-2%',
                            improvement: 1.5,
                            description: '비과세/세액공제 혜택',
                          },
                        ];

                        return investmentMethods.map((method, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between p-3 bg-white rounded-lg border border-purple-100"
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">{method.icon}</span>
                              <div>
                                <h5 className="font-semibold text-gray-900 text-sm">
                                  {method.title}
                                </h5>
                                <p className="text-xs text-gray-600 mb-1">
                                  {method.description}
                                </p>
                                <p className="text-xs text-purple-600">
                                  {method.current} → {method.target}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-600">
                                +{method.improvement}%p
                              </div>
                              <div className="text-xs text-gray-500">
                                수익률 향상
                              </div>
                            </div>
                          </div>
                        ));
                      })()}

                      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                        <div className="text-sm font-semibold text-blue-800">
                          💡 수익률 2% 향상 시 15년 후 자산 증가
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {(() => {
                            const currentAssets =
                              parseInt(formData.currentAssets) || 0;
                            const currentIncome =
                              parseInt(formData.monthlyIncome) || 0;
                            const currentExpense =
                              parseInt(formData.monthlyExpense) || 0;
                            const monthlySavings = Math.max(
                              0,
                              currentIncome - currentExpense
                            );

                            // 현재 수익률로 15년 후 자산
                            const currentReturnRate =
                              parseFloat(
                                formData.investmentReturn === 'custom'
                                  ? formData.customInvestmentReturn || '5'
                                  : formData.investmentReturn || '5'
                              ) / 100;

                            // 개선된 수익률로 15년 후 자산 (+2%)
                            const improvedReturnRate = currentReturnRate + 0.02;

                            // 15년간 복리 계산 (단순화)
                            const currentTotal =
                              currentAssets *
                                Math.pow(1 + currentReturnRate, 15) +
                              monthlySavings *
                                12 *
                                ((Math.pow(1 + currentReturnRate, 15) - 1) /
                                  currentReturnRate);
                            const improvedTotal =
                              currentAssets *
                                Math.pow(1 + improvedReturnRate, 15) +
                              monthlySavings *
                                12 *
                                ((Math.pow(1 + improvedReturnRate, 15) - 1) /
                                  improvedReturnRate);

                            const difference = improvedTotal - currentTotal;
                            const percentage = (
                              (difference / currentTotal) *
                              100
                            ).toFixed(0);

                            return `${formatCurrency(
                              String(difference / 10000)
                            )} (+${percentage}%)`;
                          })()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detailed Results */}
        {showResults && (
          <div className="mt-8 space-y-8">
            {/* Scenario Charts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span>시나리오별 자산 성장 비교</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={selectedScenario}
                  onValueChange={setSelectedScenario}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="worst" className="text-red-600">
                      최악 시나리오
                    </TabsTrigger>
                    <TabsTrigger value="average" className="text-blue-600">
                      평균 시나리오
                    </TabsTrigger>
                    <TabsTrigger value="best" className="text-green-600">
                      최선 시나리오
                    </TabsTrigger>
                  </TabsList>

                  {Object.keys(scenarios).map((scenario) => (
                    <TabsContent key={scenario} value={scenario}>
                      <div className="h-80 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={getScenarioData(scenario)}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                            <YAxis
                              tickFormatter={(value) => {
                                if (value >= 100000000) {
                                  return `${(value / 100000000).toFixed(1)}조`;
                                } else if (value >= 10000) {
                                  return `${(value / 10000).toFixed(1)}억`;
                                } else if (value >= 1000) {
                                  return `${(value / 1000).toFixed(1)}천만`;
                                } else {
                                  return `${value}만`;
                                }
                              }}
                              tick={{ fontSize: 12 }}
                              width={80}
                            />
                            <Tooltip
                              formatter={(value, name) => {
                                if (name === 'assets') {
                                  const formattedValue =
                                    formatCurrency(String(value)) ||
                                    `${value.toLocaleString()}만원`;
                                  return [formattedValue, '총 자산'];
                                }
                                if (name === 'savings') {
                                  const formattedValue =
                                    formatCurrency(String(value)) ||
                                    `${value.toLocaleString()}만원`;
                                  return [formattedValue, '월 저축'];
                                }
                                return [value, name];
                              }}
                              labelFormatter={(label) => `시점: ${label}`}
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '12px',
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="assets"
                              stroke={scenarios[scenario].color}
                              strokeWidth={3}
                              dot={{
                                fill: scenarios[scenario].color,
                                strokeWidth: 2,
                                r: 4,
                              }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* 자산 구성 분석 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5 text-orange-600" />
                    <span>15년 후 자산 구성</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Tooltip
                          formatter={(value, name) => {
                            const formattedValue =
                              formatCurrency(String(value)) ||
                              `${value.toLocaleString()}만원`;
                            return [formattedValue, name];
                          }}
                        />
                        <RechartsPieChart
                          dataKey="value"
                          data={getAssetBreakdown()}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {getAssetBreakdown().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </RechartsPieChart>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 space-y-2">
                    {getAssetBreakdown().map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: item.fill }}
                          ></div>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="font-semibold">
                          {formatCurrency(String(item.value)) ||
                            `${item.value.toLocaleString()}만원`}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    <span>연도별 수입/지출 변화</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getScenarioData(selectedScenario)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                        <YAxis
                          tickFormatter={(value) => {
                            if (value >= 100000000) {
                              return `${(value / 100000000).toFixed(1)}조`;
                            } else if (value >= 10000) {
                              return `${(value / 10000).toFixed(1)}억`;
                            } else if (value >= 1000) {
                              return `${(value / 1000).toFixed(1)}천만`;
                            } else {
                              return `${value}만`;
                            }
                          }}
                          tick={{ fontSize: 12 }}
                          width={80}
                        />
                        <Tooltip
                          formatter={(value, name) => {
                            const formattedValue =
                              formatCurrency(String(value)) ||
                              `${value.toLocaleString()}만원`;
                            return [
                              formattedValue,
                              name === 'income' ? '월 수입' : '월 지출',
                            ];
                          }}
                        />
                        <Bar dataKey="income" fill="#10b981" name="income" />
                        <Bar dataKey="expense" fill="#ef4444" name="expense" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetSimulation;
