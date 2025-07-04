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
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Calculator, AlertTriangle, ChevronDown } from 'lucide-react';
import ProgressBar from '@/components/loan/ProgressBar';

interface FormData {
  monthlyIncome: string;
  monthlyExpense: string;
  currentAssets: string;
  targetHousePrice: string;
  incomeGrowthRate: string;
  expenseGrowthRate: string;
  investmentReturn: string;
  customIncomeGrowthRate: string;
  customExpenseGrowthRate: string;
  customInvestmentReturn: string;
}

interface AssetFormProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  handleNumberKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleNumberPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  formatCurrency: (value: string) => string;
  expandedSections: { basic: boolean; future: boolean };
  toggleSection: (section: string) => void;
  progress: number;
  encouragementMessage: { icon: string; message: string; color: string };
  onGenerateSimulation: () => void;
}

const AssetForm = ({
  formData,
  handleInputChange,
  handleNumberKeyDown,
  handleNumberPaste,
  formatCurrency,
  expandedSections,
  toggleSection,
  progress,
  encouragementMessage,
  onGenerateSimulation,
}: AssetFormProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-green-600" />
          <span>시뮬레이션 설정</span>
        </CardTitle>
        <CardDescription>
          현재 상황과 미래 변화 전망을 입력해주세요
        </CardDescription>

        {/* 진행률 바 */}
        <ProgressBar
          progress={progress}
          encouragementMessage={encouragementMessage}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 기본 정보 */}
        <Collapsible
          open={expandedSections.basic}
          onOpenChange={() => toggleSection('basic')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
              <span>📊 기본 정보</span>
              {formData.monthlyIncome &&
                formData.monthlyExpense &&
                formData.currentAssets &&
                formData.targetHousePrice && (
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
                <Label htmlFor="monthlyIncome">월 수입 (만원)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="예: 350"
                  value={formData.monthlyIncome}
                  onChange={(e) =>
                    handleInputChange('monthlyIncome', e.target.value)
                  }
                  onKeyDown={handleNumberKeyDown}
                  onPaste={handleNumberPaste}
                  min="0"
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
                  onKeyDown={handleNumberKeyDown}
                  onPaste={handleNumberPaste}
                  min="0"
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
                onKeyDown={handleNumberKeyDown}
                onPaste={handleNumberPaste}
                min="0"
              />
              {formData.currentAssets && (
                <p className="text-sm text-blue-600 font-medium">
                  💰 {formatCurrency(formData.currentAssets)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetHousePrice">목표 주택 가격 (만원)</Label>
              <Input
                id="targetHousePrice"
                type="number"
                placeholder="예: 50000"
                value={formData.targetHousePrice}
                onChange={(e) =>
                  handleInputChange('targetHousePrice', e.target.value)
                }
                onKeyDown={handleNumberKeyDown}
                onPaste={handleNumberPaste}
                min="0"
              />
              {formData.targetHousePrice && (
                <p className="text-sm text-green-600 font-medium">
                  🏠 {formatCurrency(formData.targetHousePrice)}
                </p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* 미래 전망 설정 */}
        <Collapsible
          open={expandedSections.future}
          onOpenChange={() => toggleSection('future')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
              <span>🔮 미래 전망 설정</span>
              {formData.incomeGrowthRate &&
                formData.expenseGrowthRate &&
                formData.investmentReturn && (
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
                expandedSections.future ? 'transform rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            {(formData.incomeGrowthRate === 'custom' ||
              formData.expenseGrowthRate === 'custom' ||
              formData.investmentReturn === 'custom') && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="font-medium">💡 고급 설정 활성화</div>
                  <div className="text-sm mt-1">
                    사용자 정의 값을 설정하셨습니다. 시나리오 분석 시 이 값들을
                    기준으로 상대적 변화를 적용합니다.
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incomeGrowthRate">연간 수입 증가율 (%)</Label>
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
                    onKeyDown={handleNumberKeyDown}
                    onPaste={handleNumberPaste}
                    className="mt-2"
                    min="0"
                    max="50"
                    step="0.1"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expenseGrowthRate">연간 지출 증가율 (%)</Label>
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
                    onKeyDown={handleNumberKeyDown}
                    onPaste={handleNumberPaste}
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
                    onKeyDown={handleNumberKeyDown}
                    onPaste={handleNumberPaste}
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
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">현재 월 저축액</h4>
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
          onClick={onGenerateSimulation}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={!formData.monthlyIncome || !formData.monthlyExpense}
        >
          정밀 시뮬레이션 실행
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssetForm;
