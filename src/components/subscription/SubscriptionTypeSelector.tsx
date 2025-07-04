import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { subscriptionTypes } from '@/mocks/subscriptionData';

interface SubscriptionTypeSelectorProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
}

const SubscriptionTypeSelector = ({
  selectedType,
  setSelectedType,
}: SubscriptionTypeSelectorProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-blue-600" />
          <span>청약 유형 선택</span>
        </CardTitle>
        <CardDescription>
          신청하고자 하는 청약 유형을 먼저 선택해주세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(subscriptionTypes).map(([key, type]) => {
            const IconComponent = type.icon;
            return (
              <div
                key={key}
                onClick={() => setSelectedType(key)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedType === key
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <IconComponent
                    className={`h-6 w-6 mt-1 ${
                      selectedType === key ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {type.description}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      최대 {type.maxScore}점
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionTypeSelector;
