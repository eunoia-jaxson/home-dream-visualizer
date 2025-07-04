import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import GoogleMap from '@/components/GoogleMap';
import type { RegionInfo } from '@/types/region';

interface RegionMapCardProps {
  showResults: boolean;
  recommendations: RegionInfo[];
}

const RegionMapCard = ({
  showResults,
  recommendations,
}: RegionMapCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span>추천 지역 지도</span>
        </CardTitle>
        <CardDescription>추천 지역의 위치와 특성</CardDescription>
      </CardHeader>
      <CardContent>
        {showResults ? (
          <div className="h-80">
            <GoogleMap recommendations={recommendations} />
          </div>
        ) : (
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">지역 추천 후 지도가 표시됩니다</p>
            </div>
          </div>
        )}

        {showResults && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-gray-900">추천 지역 요약</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">평균 가격대:</span>
                <span className="font-semibold ml-2">4-6억원</span>
              </div>
              <div>
                <span className="text-gray-600">추천 개수:</span>
                <span className="font-semibold ml-2">
                  {recommendations.length}개 지역
                </span>
              </div>
              <div>
                <span className="text-gray-600">평균 매칭도:</span>
                <span className="font-semibold ml-2">
                  {Math.round(
                    recommendations.reduce((sum, r) => sum + r.matchScore, 0) /
                      recommendations.length
                  )}
                  점
                </span>
              </div>
              <div>
                <span className="text-gray-600">분석 항목:</span>
                <span className="font-semibold ml-2">10개 지표</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegionMapCard;
