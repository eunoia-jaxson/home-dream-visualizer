import { Button } from '@/components/ui/button';
import { ArrowLeft, PiggyBank } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoanSimulationHeader = () => {
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
            <div className="p-2 bg-purple-600 rounded-lg">
              <PiggyBank className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                대출 시뮬레이션
              </h1>
              <p className="text-sm text-gray-600">
                정부 대출 상품 조건을 확인하고 상환액을 계산하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoanSimulationHeader;
