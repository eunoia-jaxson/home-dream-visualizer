
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, TrendingUp, Home, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const AssetSimulation = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: "",
    monthlyExpense: "",
    currentAssets: "",
    monthlySavings: "",
    targetAmount: ""
  });

  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSimulation = () => {
    const income = parseInt(formData.monthlyIncome) || 0;
    const expense = parseInt(formData.monthlyExpense) || 0;
    const currentAssets = parseInt(formData.currentAssets) || 0;
    const savings = income - expense;
    
    const data = [];
    let currentAmount = currentAssets;
    
    for (let year = 0; year <= 10; year++) {
      data.push({
        year: year === 0 ? "현재" : `${year}년 후`,
        assets: Math.round(currentAmount / 10000),
        canBuy: currentAmount >= 300000000 ? "구매 가능" : "저축 필요"
      });
      currentAmount += savings * 12;
    }
    
    setSimulationData(data);
    setShowResults(true);
  };

  const possibleAreas = [
    { area: "경기 성남시", price: "4억원대", type: "아파트 32평" },
    { area: "서울 노원구", price: "5억원대", type: "아파트 25평" },
    { area: "인천 연수구", price: "3억원대", type: "아파트 29평" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
              <div className="p-2 bg-green-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">자산 성장 시뮬레이션</h1>
                <p className="text-sm text-gray-600">미래 자산 증가를 예측해보세요</p>
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
                <Calculator className="h-5 w-5 text-green-600" />
                <span>기본 정보 입력</span>
              </CardTitle>
              <CardDescription>
                현재 수입과 지출 상황을 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">월 수입 (만원)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="예: 350"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthlyExpense">월 지출 (만원)</Label>
                <Input
                  id="monthlyExpense"
                  type="number"
                  placeholder="예: 200"
                  value={formData.monthlyExpense}
                  onChange={(e) => handleInputChange("monthlyExpense", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentAssets">현재 자산 (만원)</Label>
                <Input
                  id="currentAssets"
                  type="number"
                  placeholder="예: 3000"
                  value={formData.currentAssets}
                  onChange={(e) => handleInputChange("currentAssets", e.target.value)}
                />
              </div>

              <Separator />

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">월 저축 예상액</h4>
                <p className="text-2xl font-bold text-green-600">
                  {formData.monthlyIncome && formData.monthlyExpense 
                    ? `${parseInt(formData.monthlyIncome) - parseInt(formData.monthlyExpense)}만원`
                    : "0만원"
                  }
                </p>
              </div>

              <Button 
                onClick={generateSimulation} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!formData.monthlyIncome || !formData.monthlyExpense}
              >
                시뮬레이션 실행
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {showResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>자산 성장 예측</span>
                </CardTitle>
                <CardDescription>
                  시간에 따른 자산 증가 추이
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value}만원`, "자산"]}
                        labelFormatter={(label) => `시점: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="assets" 
                        stroke="#16a34a" 
                        strokeWidth={3}
                        dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">구매 가능 시점</h4>
                  <div className="space-y-2">
                    {simulationData.find(d => d.assets >= 3000) ? (
                      <p className="text-blue-700">
                        <span className="font-bold">
                          약 {simulationData.findIndex(d => d.assets >= 3000)}년 후
                        </span> 주택 구매 가능
                      </p>
                    ) : (
                      <p className="text-blue-700">
                        현재 저축 패턴으로는 <span className="font-bold">10년 이상</span> 소요 예상
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Possible Areas */}
        {showResults && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-purple-600" />
                <span>구매 가능 지역 예상</span>
              </CardTitle>
              <CardDescription>
                현재 자산 기준으로 구매 가능한 지역들
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {possibleAreas.map((area, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-900">{area.area}</h4>
                    <p className="text-sm text-gray-600">{area.type}</p>
                    <p className="text-lg font-bold text-green-600 mt-2">{area.price}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssetSimulation;
