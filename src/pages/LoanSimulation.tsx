
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, PiggyBank, TrendingDown, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const LoanSimulation = () => {
  const [formData, setFormData] = useState({
    housePrice: "",
    monthlyIncome: "",
    existingLoan: "",
    marriageStatus: "",
    age: "",
    region: ""
  });

  const [loanResults, setLoanResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateLoan = () => {
    const housePrice = parseInt(formData.housePrice) * 10000 || 0;
    const monthlyIncome = parseInt(formData.monthlyIncome) || 0;
    const annualIncome = monthlyIncome * 12;
    
    const loans = [
      {
        name: "디딤돌 대출",
        type: "정부지원",
        maxAmount: Math.min(housePrice * 0.8, 250000000),
        interestRate: 2.4,
        eligible: annualIncome <= 60000000 && formData.marriageStatus === "married",
        condition: "신혼부부, 연소득 6천만원 이하",
        monthlyPayment: 0
      },
      {
        name: "보금자리론",
        type: "정부지원",
        maxAmount: Math.min(housePrice * 0.7, 300000000),
        interestRate: 2.8,
        eligible: annualIncome <= 70000000,
        condition: "무주택자, 연소득 7천만원 이하",
        monthlyPayment: 0
      },
      {
        name: "일반 주택담보대출",
        type: "시중은행",
        maxAmount: housePrice * 0.6,
        interestRate: 4.2,
        eligible: true,
        condition: "소득 증빙 가능자",
        monthlyPayment: 0
      }
    ];

    // 월 상환액 계산 (원리금균등상환, 30년)
    loans.forEach(loan => {
      if (loan.maxAmount > 0) {
        const monthlyRate = loan.interestRate / 100 / 12;
        const months = 30 * 12;
        loan.monthlyPayment = Math.round(
          (loan.maxAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
        );
      }
    });

    setLoanResults(loans);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
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
                <h1 className="text-xl font-bold text-gray-900">대출 시뮬레이션</h1>
                <p className="text-sm text-gray-600">정부 대출 상품 조건을 확인하고 상환액을 계산하세요</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PiggyBank className="h-5 w-5 text-purple-600" />
                <span>대출 조건 입력</span>
              </CardTitle>
              <CardDescription>
                대출 시뮬레이션을 위한 정보를 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="housePrice">주택 가격 (만원)</Label>
                <Input
                  id="housePrice"
                  type="number"
                  placeholder="예: 30000 (3억원)"
                  value={formData.housePrice}
                  onChange={(e) => handleInputChange("housePrice", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">월 소득 (만원)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="예: 400"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="existingLoan">기존 대출 (만원)</Label>
                <Input
                  id="existingLoan"
                  type="number"
                  placeholder="예: 1000"
                  value={formData.existingLoan}
                  onChange={(e) => handleInputChange("existingLoan", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>결혼 여부</Label>
                <Select value={formData.marriageStatus} onValueChange={(value) => handleInputChange("marriageStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="married">기혼</SelectItem>
                    <SelectItem value="single">미혼</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">나이</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="예: 32"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                />
              </div>

              <Button 
                onClick={calculateLoan} 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!formData.housePrice || !formData.monthlyIncome}
              >
                대출 조건 확인하기
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {showResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  <span>대출 상품 비교</span>
                </CardTitle>
                <CardDescription>
                  조건에 맞는 대출 상품들
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loanResults.map((loan, index) => (
                  <div 
                    key={index}
                    className={`p-4 border rounded-lg ${
                      loan.eligible 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{loan.name}</h4>
                        <p className="text-sm text-gray-600">{loan.type}</p>
                      </div>
                      {loan.eligible ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">이용가능</span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">조건미달</span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">최대 대출액</span>
                        <span className="font-semibold">{(loan.maxAmount / 10000).toLocaleString()}만원</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">금리</span>
                        <span className="font-semibold text-purple-600">{loan.interestRate}%</span>
                      </div>
                      {loan.eligible && loan.monthlyPayment > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">월 상환액</span>
                          <span className="font-bold text-blue-600">
                            {Math.round(loan.monthlyPayment / 10000).toLocaleString()}만원
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600">{loan.condition}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Additional Info */}
        {showResults && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>대출 이용 시 주의사항</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">정부 지원 대출</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 소득 및 자산 기준 충족 필요</li>
                    <li>• 실거주 목적만 가능</li>
                    <li>• 중도상환 수수료 면제</li>
                    <li>• 대출 한도 및 금리 우대</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">일반 은행 대출</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 신용도에 따른 금리 차등</li>
                    <li>• DSR 규제 적용</li>
                    <li>• 중도상환 수수료 발생 가능</li>
                    <li>• 상품별 조건 상이</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LoanSimulation;
