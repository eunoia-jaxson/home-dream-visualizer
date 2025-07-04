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
import { Calculator, ChevronDown } from 'lucide-react';
import ProgressBar from '@/components/loan/ProgressBar';

interface FormData {
  householdPeriod: string;
  dependents: string;
  subscriptionPeriod: string;
  marriagePeriod: string;
  monthlyIncome: string;
  totalAssets: string;
  age: string;
  taxPaymentPeriod: string;
  childrenCount: string;
  parentSupportPeriod: string;
  area: string;
}

interface SubscriptionFormProps {
  selectedType: string;
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  handleNumberKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleNumberPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  formatCurrency: (value: string) => string;
  expandedSections: { common: boolean; specific: boolean };
  toggleSection: (section: string) => void;
  progress: number;
  encouragementMessage: { icon: string; message: string; color: string };
  onCalculate: () => void;
}

const SubscriptionForm = ({
  selectedType,
  formData,
  handleInputChange,
  handleNumberKeyDown,
  handleNumberPaste,
  formatCurrency,
  expandedSections,
  toggleSection,
  progress,
  encouragementMessage,
  onCalculate,
}: SubscriptionFormProps) => {
  if (!selectedType) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          <span>청약 정보 입력</span>
        </CardTitle>
        <CardDescription>
          선택한 청약 유형에 필요한 정보를 입력해주세요
        </CardDescription>

        {/* 진행률 바 */}
        <ProgressBar
          progress={progress}
          encouragementMessage={encouragementMessage}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 공통 정보 섹션 */}
          <Collapsible
            open={expandedSections.common}
            onOpenChange={() => toggleSection('common')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <span>📋 공통 정보</span>
                {formData.householdPeriod &&
                  formData.dependents &&
                  formData.subscriptionPeriod && (
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
                  expandedSections.common ? 'transform rotate-180' : ''
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
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
                  onKeyDown={handleNumberKeyDown}
                  onPaste={handleNumberPaste}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependents">부양가족 수 (명)</Label>
                <Input
                  id="dependents"
                  type="number"
                  placeholder="예: 2"
                  value={formData.dependents}
                  onChange={(e) =>
                    handleInputChange('dependents', e.target.value)
                  }
                  onKeyDown={handleNumberKeyDown}
                  onPaste={handleNumberPaste}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscriptionPeriod">
                  청약통장 가입기간 (년)
                </Label>
                <Input
                  id="subscriptionPeriod"
                  type="number"
                  placeholder="예: 3"
                  value={formData.subscriptionPeriod}
                  onChange={(e) =>
                    handleInputChange('subscriptionPeriod', e.target.value)
                  }
                  onKeyDown={handleNumberKeyDown}
                  onPaste={handleNumberPaste}
                  min="0"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* 유형별 추가 정보 섹션 */}
          {(selectedType === 'newlywed' ||
            selectedType === 'first_life' ||
            selectedType === 'multi_child' ||
            selectedType === 'old_parent') && (
            <Collapsible
              open={expandedSections.specific}
              onOpenChange={() => toggleSection('specific')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <span>🔍 유형별 추가 정보</span>
                  {((selectedType === 'newlywed' &&
                    formData.marriagePeriod &&
                    formData.monthlyIncome &&
                    formData.totalAssets) ||
                    (selectedType === 'first_life' &&
                      formData.age &&
                      formData.taxPaymentPeriod) ||
                    (selectedType === 'multi_child' &&
                      formData.childrenCount) ||
                    (selectedType === 'old_parent' &&
                      formData.parentSupportPeriod)) && (
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
                    expandedSections.specific ? 'transform rotate-180' : ''
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
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
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncome">
                        부부합산 월소득 (만원)
                      </Label>
                      <Input
                        id="monthlyIncome"
                        type="number"
                        placeholder="예: 500"
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
                      <Label htmlFor="totalAssets">총자산 (만원)</Label>
                      <Input
                        id="totalAssets"
                        type="number"
                        placeholder="예: 20000"
                        value={formData.totalAssets}
                        onChange={(e) =>
                          handleInputChange('totalAssets', e.target.value)
                        }
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        min="0"
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
                        onChange={(e) =>
                          handleInputChange('age', e.target.value)
                        }
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxPaymentPeriod">
                        소득세 납부기간 (년)
                      </Label>
                      <Input
                        id="taxPaymentPeriod"
                        type="number"
                        placeholder="예: 8"
                        value={formData.taxPaymentPeriod}
                        onChange={(e) =>
                          handleInputChange('taxPaymentPeriod', e.target.value)
                        }
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        min="0"
                      />
                    </div>
                  </>
                )}

                {selectedType === 'multi_child' && (
                  <div className="space-y-2">
                    <Label htmlFor="childrenCount">
                      만 19세 미만 자녀 수 (명)
                    </Label>
                    <Input
                      id="childrenCount"
                      type="number"
                      placeholder="예: 3"
                      value={formData.childrenCount}
                      onChange={(e) =>
                        handleInputChange('childrenCount', e.target.value)
                      }
                      onKeyDown={handleNumberKeyDown}
                      onPaste={handleNumberPaste}
                      min="0"
                    />
                  </div>
                )}

                {selectedType === 'old_parent' && (
                  <div className="space-y-2">
                    <Label htmlFor="parentSupportPeriod">
                      노부모 부양기간 (년)
                    </Label>
                    <Input
                      id="parentSupportPeriod"
                      type="number"
                      placeholder="예: 5"
                      value={formData.parentSupportPeriod}
                      onChange={(e) =>
                        handleInputChange('parentSupportPeriod', e.target.value)
                      }
                      onKeyDown={handleNumberKeyDown}
                      onPaste={handleNumberPaste}
                      min="0"
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
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        <Button
          onClick={onCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
          disabled={!formData.householdPeriod || !formData.subscriptionPeriod}
        >
          자격 요건 확인 및 가점 계산
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionForm;
