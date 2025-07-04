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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface FormData {
  housePrice: string;
  deposit: string;
  monthlyIncome: string;
  existingLoan: string;
  age: string;
  marriageStatus: string;
}

interface BasicInfoSectionProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  handleNumberKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleNumberPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  formatCurrency: (value: string) => string;
  expandedSections: { basic: boolean };
  toggleSection: (section: string) => void;
}

const BasicInfoSection = ({
  formData,
  handleInputChange,
  handleNumberKeyDown,
  handleNumberPaste,
  formatCurrency,
  expandedSections,
  toggleSection,
}: BasicInfoSectionProps) => {
  return (
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
            onChange={(e) => handleInputChange('housePrice', e.target.value)}
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
            onChange={(e) => handleInputChange('deposit', e.target.value)}
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
            onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
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
            onChange={(e) => handleInputChange('existingLoan', e.target.value)}
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
              onChange={(e) => handleInputChange('age', e.target.value)}
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
  );
};

export default BasicInfoSection;
