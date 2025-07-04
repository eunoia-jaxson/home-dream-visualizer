import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Target, CheckCircle2 } from 'lucide-react';
import { scenarios } from '@/mocks/assetData';

interface FormData {
  monthlyIncome: string;
  monthlyExpense: string;
  incomeGrowthRate: string;
  expenseGrowthRate: string;
  investmentReturn: string;
  customIncomeGrowthRate: string;
  customExpenseGrowthRate: string;
  customInvestmentReturn: string;
}

interface AssetTargetCardProps {
  formData: FormData;
  formatCurrency: (value: string) => string;
  getTargetAchievementYear: (scenario: string) => number | null;
}

const AssetTargetCard = ({
  formData,
  formatCurrency,
  getTargetAchievementYear,
}: AssetTargetCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span>목표 달성 전망</span>
        </CardTitle>
        <CardDescription>시나리오별 주택 구매 가능 시점</CardDescription>
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
            actualInvestmentReturn = Math.max(1, userInvestmentReturn - 3);
          } else if (key === 'best') {
            actualIncomeGrowth = userIncomeGrowthRate + 2;
            actualExpenseGrowth = Math.max(0.5, userExpenseGrowthRate - 0.5);
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
                <h4 className="font-semibold" style={{ color: scenario.color }}>
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
              <div className="font-semibold mb-2">💡 목표 달성 가속화 방법</div>
              <ul className="space-y-1 text-sm">
                <li>
                  • 월 지출을 10% 줄이면 목표 달성이{' '}
                  <span className="font-semibold text-green-600">2-3년</span>{' '}
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
                const currentExpense = parseInt(formData.monthlyExpense) || 200;
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
                          {formatCurrency(String(method.savings / 10000))}
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
                      <div className="text-xs text-gray-500">수익률 향상</div>
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
                    const currentAssets = parseInt(formData.monthlyIncome) || 0;
                    const currentIncome = parseInt(formData.monthlyIncome) || 0;
                    const currentExpense =
                      parseInt(formData.monthlyExpense) || 0;
                    const monthlySavings = Math.max(
                      0,
                      currentIncome - currentExpense
                    );

                    const currentReturnRate =
                      parseFloat(
                        formData.investmentReturn === 'custom'
                          ? formData.customInvestmentReturn || '5'
                          : formData.investmentReturn || '5'
                      ) / 100;

                    const improvedReturnRate = currentReturnRate + 0.02;

                    const currentTotal =
                      currentAssets * Math.pow(1 + currentReturnRate, 15) +
                      monthlySavings *
                        12 *
                        ((Math.pow(1 + currentReturnRate, 15) - 1) /
                          currentReturnRate);
                    const improvedTotal =
                      currentAssets * Math.pow(1 + improvedReturnRate, 15) +
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
  );
};

export default AssetTargetCard;
