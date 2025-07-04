import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  LineChart,
  DollarSign,
  Percent,
  Home,
  TrendingDown,
  Calculator,
  Shield,
  Users,
  AlertCircle,
} from 'lucide-react';
import type { LoanProduct } from '@/types/loan';

interface LoanDetailCardProps {
  selectedLoan: LoanProduct;
  formatCurrency: (value: number) => string;
}

const LoanDetailCard = ({
  selectedLoan,
  formatCurrency,
}: LoanDetailCardProps) => {
  return (
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
                    Math.round(selectedLoan.monthlyPayment / 10000)
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
              <h4 className="font-semibold text-gray-900">금리 구성</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">기준금리</span>
                  <span className="font-medium">
                    {selectedLoan.baseRate.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">가산금리</span>
                  <span className="font-medium">
                    {selectedLoan.additionalRate >= 0 ? '+' : ''}
                    {selectedLoan.additionalRate.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">우대금리</span>
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
                  {selectedLoan.conditions.map((condition, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 flex items-start"
                    >
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {condition}
                    </li>
                  ))}
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
                  {selectedLoan.restrictions.map((restriction, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-orange-600 flex items-start"
                    >
                      <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {restriction}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="text-center text-gray-600">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h4 className="font-semibold mb-2">상세 상환 계획</h4>
              <p className="text-sm">
                월별 상환 스케줄과 이자/원금 비율 분석을 제공합니다.
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  // 상환 스케줄 생성 로직 (추후 구현)
                  alert('상세 상환 계획 기능은 곧 추가될 예정입니다.');
                }}
              >
                상세 분석 보기
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LoanDetailCard;
