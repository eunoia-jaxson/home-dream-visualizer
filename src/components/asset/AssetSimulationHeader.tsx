import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AssetSimulationHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              돌아가기
            </Link>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                스마트 자산 성장 시뮬레이션
              </h1>
              <p className="text-sm text-gray-600">
                다양한 시나리오로 미래 자산을 정밀 예측해보세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AssetSimulationHeader;
