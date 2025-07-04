import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TrendingDown, AlertCircle, HelpCircle } from 'lucide-react';
import type { LoanProduct } from '@/types/loan';

interface LoanResultsCardProps {
  loanResults: LoanProduct[];
  selectedLoan: LoanProduct | null;
  setSelectedLoan: (loan: LoanProduct | null) => void;
  formatCurrency: (value: number) => string;
}

const LoanResultsCard = ({
  loanResults,
  selectedLoan,
  setSelectedLoan,
  formatCurrency,
}: LoanResultsCardProps) => {
  return (
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
            } ${selectedLoan?.id === loan.id ? 'ring-2 ring-purple-500' : ''}`}
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
                <span className="text-sm text-gray-500">최대 대출액</span>
                <div className="font-semibold text-lg">
                  {formatCurrency(loan.maxAmount / 10000)}
                </div>
              </div>
              {loan.eligible && loan.monthlyPayment > 0 && (
                <div>
                  <span className="text-sm text-gray-500">월 상환액</span>
                  <div className="font-bold text-lg text-blue-600">
                    {formatCurrency(Math.round(loan.monthlyPayment / 10000))}
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
                      <p className="font-semibold">LTV (Loan To Value)</p>
                      <p>담보인정비율: 주택가격 대비 대출가능 비율</p>
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
                      <p className="font-semibold">DTI (Debt To Income)</p>
                      <p>총부채상환비율: 연소득 대비 연간 대출이자 비율</p>
                      <p className="text-xs text-gray-500 mt-1">
                        예: 연소득 6천만원, DTI 50% → 연 이자 3천만원 한도
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
                      <p className="font-semibold">DSR (Debt Service Ratio)</p>
                      <p>
                        총부채원리금상환비율: 연소득 대비 모든 대출 원리금 비율
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        예: 연소득 6천만원, DSR 40% → 연 원리금 2.4천만원 한도
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
  );
};

export default LoanResultsCard;
