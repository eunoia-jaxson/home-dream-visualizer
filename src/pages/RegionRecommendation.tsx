
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, TrendingUp, Car, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const RegionRecommendation = () => {
  const [formData, setFormData] = useState({
    budget: "",
    childAge: "",
    workLocation: "",
    priority: "",
    transportType: ""
  });

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateRecommendations = () => {
    const budget = parseInt(formData.budget) || 0;
    
    const mockRecommendations = [
      {
        name: "성남시 분당구",
        averagePrice: "6억 2천만원",
        schoolRating: 9.2,
        transportScore: 8.5,
        infrastructureScore: 9.0,
        priceChange: "+3.2%",
        matchScore: 92,
        highlights: ["우수한 교육환경", "판교 테크노밸리 인근", "분당선 접근성"],
        schools: ["분당중앙고", "분당경영고", "분당대진고"],
        facilities: ["분당서울대병원", "야탑역 상권", "중앙공원"]
      },
      {
        name: "용인시 수지구",
        averagePrice: "4억 8천만원",
        schoolRating: 8.8,
        transportScore: 7.2,
        infrastructureScore: 8.3,
        priceChange: "+2.1%",
        matchScore: 87,
        highlights: ["교육 특구", "신분당선 연장", "상대적 저렴한 가격"],
        schools: ["수지고", "풍덕고", "상현고"],
        facilities: ["수지구청", "동천역 상권", "수지레스피아"]
      },
      {
        name: "인천시 연수구",
        averagePrice: "3억 9천만원",
        schoolRating: 8.1,
        transportScore: 8.8,
        infrastructureScore: 8.7,
        priceChange: "+1.8%",
        matchScore: 84,
        highlights: ["송도국제도시", "인천공항 접근성", "계획도시"],
        schools: ["연수고", "송도고", "채드윅국제학교"],
        facilities: ["송도컨벤시아", "센트럴파크", "연수구청"]
      }
    ];

    setRecommendations(mockRecommendations);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
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
              <div className="p-2 bg-orange-600 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">지역 추천</h1>
                <p className="text-sm text-gray-600">학군, 교통, 인프라를 고려한 맞춤형 지역 추천</p>
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
                <MapPin className="h-5 w-5 text-orange-600" />
                <span>선호 조건 입력</span>
              </CardTitle>
              <CardDescription>
                희망하시는 거주 조건을 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="budget">주택 구매 예산 (만원)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="예: 50000 (5억원)"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="childAge">자녀 나이</Label>
                <Select value={formData.childAge} onValueChange={(value) => handleInputChange("childAge", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary">초등학생</SelectItem>
                    <SelectItem value="middle">중학생</SelectItem>
                    <SelectItem value="high">고등학생</SelectItem>
                    <SelectItem value="none">자녀 없음</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>직장 위치</Label>
                <Select value={formData.workLocation} onValueChange={(value) => handleInputChange("workLocation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gangnam">강남 3구</SelectItem>
                    <SelectItem value="jongno">종로/중구</SelectItem>
                    <SelectItem value="yeouido">여의도</SelectItem>
                    <SelectItem value="pangyo">판교</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>최우선 고려사항</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">교육환경</SelectItem>
                    <SelectItem value="transport">교통편의</SelectItem>
                    <SelectItem value="price">가격 경쟁력</SelectItem>
                    <SelectItem value="infrastructure">생활인프라</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>주요 교통수단</Label>
                <Select value={formData.transportType} onValueChange={(value) => handleInputChange("transportType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subway">지하철</SelectItem>
                    <SelectItem value="car">자가용</SelectItem>
                    <SelectItem value="bus">버스</SelectItem>
                    <SelectItem value="mixed">복합</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateRecommendations} 
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={!formData.budget || !formData.priority}
              >
                지역 추천받기
              </Button>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>지역 분포도</span>
              </CardTitle>
              <CardDescription>
                추천 지역의 위치와 특성
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">지역 추천 후 지도가 표시됩니다</p>
                </div>
              </div>
              
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
                      <span className="font-semibold ml-2">{recommendations.length}개 지역</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        {showResults && (
          <div className="mt-8 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">맞춤 지역 추천</h3>
            
            {recommendations.map((region, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-900">{region.name}</CardTitle>
                      <CardDescription className="text-lg font-semibold text-blue-600">
                        {region.averagePrice}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-bold text-lg">{region.matchScore}</span>
                        <span className="text-sm text-gray-500">/ 100</span>
                      </div>
                      <Badge variant={region.priceChange.startsWith('+') ? 'destructive' : 'default'} className="text-xs">
                        {region.priceChange}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">교육환경</p>
                        <p className="font-semibold">{region.schoolRating}/10</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Car className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">교통편의</p>
                        <p className="font-semibold">{region.transportScore}/10</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">인프라</p>
                        <p className="font-semibold">{region.infrastructureScore}/10</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">주요 특징</h4>
                      <div className="flex flex-wrap gap-2">
                        {region.highlights.map((highlight: string, idx: number) => (
                          <Badge key={idx} variant="secondary">{highlight}</Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">주요 학교</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {region.schools.map((school: string, idx: number) => (
                            <li key={idx}>• {school}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">편의시설</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {region.facilities.map((facility: string, idx: number) => (
                            <li key={idx}>• {facility}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionRecommendation;
