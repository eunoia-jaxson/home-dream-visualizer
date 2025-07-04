import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Award, Info } from 'lucide-react';
import type { EligibilityResult } from '@/types/subscription';

interface CalculationResultProps {
  selectedType: string;
  eligibilityResult: EligibilityResult;
  calculatedScore: number | null;
}

const CalculationResult = ({
  selectedType,
  eligibilityResult,
  calculatedScore,
}: CalculationResultProps) => {
  if (!eligibilityResult) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-600" />
          <span>계산 결과</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!eligibilityResult.eligible ? (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-2">자격 요건 미충족</div>
              <ul className="space-y-1">
                {eligibilityResult.reasons.map(
                  (reason: string, index: number) => (
                    <li key={index} className="text-sm">
                      • {reason}
                    </li>
                  )
                )}
              </ul>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {calculatedScore}점
              </div>
              <div className="text-green-600 font-semibold mb-2">
                ✓ 자격 요건 충족
              </div>
              <p className="text-gray-600">
                {calculatedScore && calculatedScore >= 60
                  ? '우수한 가점입니다!'
                  : calculatedScore && calculatedScore >= 45
                  ? '보통 수준의 가점입니다'
                  : '가점 향상이 필요합니다'}
              </p>
            </div>

            {selectedType.includes('general') && calculatedScore && (
              <>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">무주택 기간</span>
                    <span className="font-semibold">32점</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">부양가족</span>
                    <span className="font-semibold">35점</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">청약통장 가입기간</span>
                    <span className="font-semibold">17점</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CalculationResult;
