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
  loanPurpose: string;
  jobType: string;
  workExperience: string;
  children: string;
  houseType: string;
  firstHome: string;
  region: string;
}

interface PersonalInfoSectionProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  handleNumberKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleNumberPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  expandedSections: { personal: boolean };
  toggleSection: (section: string) => void;
}

const PersonalInfoSection = ({
  formData,
  handleInputChange,
  handleNumberKeyDown,
  handleNumberPaste,
  expandedSections,
  toggleSection,
}: PersonalInfoSectionProps) => {
  return (
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
            onValueChange={(value) => handleInputChange('loanPurpose', value)}
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
            onValueChange={(value) => handleInputChange('jobType', value)}
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
              onChange={(e) => handleInputChange('children', e.target.value)}
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
            onValueChange={(value) => handleInputChange('houseType', value)}
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
            onValueChange={(value) => handleInputChange('firstHome', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">생애최초 (무주택)</SelectItem>
              <SelectItem value="no">주택 소유 경험 있음</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>지역</Label>
          <Select
            value={formData.region}
            onValueChange={(value) => handleInputChange('region', value)}
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
  );
};

export default PersonalInfoSection;
