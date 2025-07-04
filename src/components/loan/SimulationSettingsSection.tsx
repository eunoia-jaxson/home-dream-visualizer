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

interface SimulationSettings {
  term: string;
  rateType: string;
  repaymentType: string;
}

interface SimulationSettingsSectionProps {
  simulationSettings: SimulationSettings;
  handleSimulationChange: (field: string, value: string) => void;
  expandedSections: { financial: boolean };
  toggleSection: (section: string) => void;
}

const SimulationSettingsSection = ({
  simulationSettings,
  handleSimulationChange,
  expandedSections,
  toggleSection,
}: SimulationSettingsSectionProps) => {
  return (
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
              onValueChange={(value) => handleSimulationChange('term', value)}
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
              <SelectItem value="equal_payment">원리금균등상환</SelectItem>
              <SelectItem value="equal_principal">원금균등상환</SelectItem>
              <SelectItem value="bullet">만기일시상환</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SimulationSettingsSection;
