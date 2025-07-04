import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import type { Recommendation } from '@/types/subscription';

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

const RecommendationsList = ({ recommendations }: RecommendationsListProps) => {
  if (recommendations.length === 0) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-green-600" />
          <span>신청 가능한 청약 단지</span>
        </CardTitle>
        <CardDescription>
          현재 조건으로 신청 가능한 단지들입니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-green-200 bg-green-50 rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  신청가능
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{item.location}</p>
              <p className="text-sm text-gray-600 mb-1">{item.type}</p>
              <Badge variant="outline" className="text-xs mb-2">
                {item.subscriptionType}
              </Badge>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">
                  {item.price}
                </span>
                <span className="text-xs text-gray-500">
                  경쟁률 {item.competition}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                최소 가점: {item.minScore}점
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsList;
