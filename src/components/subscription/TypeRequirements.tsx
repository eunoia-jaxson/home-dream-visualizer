import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { subscriptionTypes } from '@/mocks/subscriptionData';

interface TypeRequirementsProps {
  selectedType: string;
}

const TypeRequirements = ({ selectedType }: TypeRequirementsProps) => {
  if (!selectedType) return null;

  const type =
    subscriptionTypes[selectedType as keyof typeof subscriptionTypes];
  if (!type) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-green-600" />
          <span>{type.name} 자격 요건</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {type.requirements.map((req, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">•</span>
              <span className="text-gray-700">{req}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TypeRequirements;
