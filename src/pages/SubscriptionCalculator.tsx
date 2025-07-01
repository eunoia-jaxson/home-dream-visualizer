
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calculator, Award, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const SubscriptionCalculator = () => {
  const [formData, setFormData] = useState({
    householdPeriod: "",
    dependents: "",
    subscriptionPeriod: "",
    isFirstTime: "",
    area: ""
  });

  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateScore = () => {
    let score = 0;
    
    // 무주택 기간 점수 (최대 32점)
    const householdYears = parseInt(formData.householdPeriod) || 0;
    if (householdYears >= 15) score += 32;
    else if (householdYears >= 10) score += 28;
    else if (householdYears >= 5) score += 24;
    else if (householdYears >= 2) score += 20;
    else score += 16;

    // 부양가족 점수 (최대 35점)
    const dependentsCount = parseInt(formData.dependents) || 0;
    if (dependentsCount >= 6) score += 35;
    else if (dependentsCount >= 4) score += 30;
    else if (dependentsCount >= 3) score += 25;
    else if (dependentsCount >= 2) score += 20;
    else if (dependentsCount >= 1) score += 15;
    else score += 5;

    // 청약통장 가입기간 점수 (최대 17점)
    const subscriptionYears = parseInt(formData.subscriptionPeriod) || 0;
    if (subscriptionYears >= 15) score += 17;
    else if (subscriptionYears >= 10) score += 15;
    else if (subscriptionYears >= 5) score += 12;
    else if (subscriptionYears >= 2) score += 10;
    else score += 5;

    setCalculatedScore(score);
    generateRecommendations(score);
  };

  const generateRecommendations = (score: number) => {
    const mockRecommendations = [
      {
        name: "힐스테이트 송도",
        location: "인천 연수구",
        type: "민간분양",
        minScore: 45,
        competition: "3.2:1",
        price: "4억 5천만원",
        canApply: score >= 45
      },
      {
        name: "래미안 위브",
        location: "경기 성남시",
        type: "민간분양",
        minScore: 50,
        competition: "5.1:1",
        price: "5억 2천만원",
        canApply: score >= 50
      },
      {
        name: "푸르지오 센트럴파크",
        location: "서울 노원구",
        type: "민간분양",
        minScore: 55,
        competition: "8.3:1",
        price: "6억 8천만원",
        canApply: score >= 55
      }
    ];

    setRecommendations(mockRecommendations);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">청약 가점 계산기</h1>
                <p className="text-sm text-gray-600">청약 가점을 계산하고 당첨 가능 단지를 확인하세요</p>
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
                <Calculator className="h-5 w-5 text-blue-600" />
                <span>청약 정보 입력</span>
              </CardTitle>
              <CardDescription>
                청약 가점 계산을 위한 정보를 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="householdPeriod">무주택 세대주 기간 (년)</Label>
                <Input
                  id="householdPeriod"
                  type="number"
                  placeholder="예: 5"
                  value={formData.householdPeriod}
                  onChange={(e) => handleInputChange("householdPeriod", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dependents">부양가족 수 (명)</Label>
                <Input
                  id="dependents"
                  type="number"
                  placeholder="예: 2"
                  value={formData.dependents}
                  onChange={(e) => handleInputChange("dependents", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscriptionPeriod">청약통장 가입기간 (년)</Label>
                <Input
                  id="subscriptionPeriod"
                  type="number"
                  placeholder="예: 3"
                  value={formData.subscriptionPeriod}
                  onChange={(e) => handleInputChange("subscriptionPeriod", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>생애최초 특별공급 해당 여부</Label>
                <Select value={formData.isFirstTime} onValueChange={(value) => handleInputChange("isFirstTime", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">해당됨</SelectItem>
                    <SelectItem value="no">해당 안됨</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>희망 지역</Label>
                <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seoul">서울특별시</SelectItem>
                    <SelectItem value="gyeonggi">경기도</SelectItem>
                    <SelectItem value="incheon">인천광역시</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateScore} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!formData.householdPeriod || !formData.dependents || !formData.subscriptionPeriod}
              >
                가점 계산하기
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {calculatedScore !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span>청약 가점 결과</span>
                </CardTitle>
                <CardDescription>
                  계산된 청약 가점과 평가
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {calculatedScore}점
                  </div>
                  <p className="text-gray-600">
                    {calculatedScore >= 60 ? "우수한 가점입니다!" : 
                     calculatedScore >= 45 ? "보통 수준의 가점입니다" : 
                     "가점 향상이 필요합니다"}
                  </p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">무주택 기간</span>
                    <span className="font-semibold">
                      {Math.min(32, Math.max(16, 16 + Math.floor(parseInt(formData.householdPeriod || "0") / 2) * 4))}점
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">부양가족</span>
                    <span className="font-semibold">
                      {Math.min(35, 5 + (parseInt(formData.dependents || "0") * 5))}점
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">청약통장 가입기간</span>
                    <span className="font-semibold">
                      {Math.min(17, 5 + Math.floor(parseInt(formData.subscriptionPeriod || "0") / 2) * 2)}점
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span>추천 청약 단지</span>
              </CardTitle>
              <CardDescription>
                현재 가점으로 신청 가능한 단지들
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg transition-all ${
                      item.canApply 
                        ? 'border-green-200 bg-green-50 hover:shadow-md' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      {item.canApply ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">신청가능</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">가점부족</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{item.location}</p>
                    <p className="text-sm text-gray-600 mb-2">{item.type}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">{item.price}</span>
                      <span className="text-xs text-gray-500">경쟁률 {item.competition}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      최소 가점: {item.minScore}점
                    </div>
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

export default SubscriptionCalculator;
