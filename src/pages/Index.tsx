
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Home, TrendingUp, MapPin, PiggyBank, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "자산 성장 시뮬레이션",
      description: "수입과 지출을 입력하여 미래 자산 성장을 예측하고 주택 구매 가능 시점을 확인하세요.",
      link: "/asset-simulation",
      color: "text-green-600"
    },
    {
      icon: Calculator,
      title: "청약 가점 계산기",
      description: "무주택 기간, 부양가족 수 등을 입력하여 청약 가점을 자동으로 계산하고 당첨 가능 단지를 추천받으세요.",
      link: "/subscription-calculator",
      color: "text-blue-600"
    },
    {
      icon: PiggyBank,
      title: "대출 시뮬레이션",
      description: "디딤돌론, 보금자리론 등 정부 대출 상품의 조건을 확인하고 월 상환액을 계산해보세요.",
      link: "/loan-simulation",
      color: "text-purple-600"
    },
    {
      icon: MapPin,
      title: "지역 추천",
      description: "학군, 교통, 인프라를 고려한 맞춤형 지역 추천과 해당 지역의 주택 시세를 확인하세요.",
      link: "/region-recommendation",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">내 집 마련 시뮬레이터</h1>
                <p className="text-sm text-gray-600">당신의 꿈을 현실로 만들어보세요</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            내 집 마련, 이제 <span className="text-green-600">계획</span>부터 시작하세요
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            복잡한 부동산 시장과 청약 제도를 쉽게 이해하고, 
            당신만의 맞춤형 내 집 마련 계획을 세워보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link to="/asset-simulation">
                <TrendingUp className="mr-2 h-5 w-5" />
                시뮬레이션 시작하기
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/subscription-calculator">
                <Calculator className="mr-2 h-5 w-5" />
                청약 가점 계산하기
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              주요 기능
            </h3>
            <p className="text-lg text-gray-600">
              내 집 마련을 위한 모든 도구가 한 곳에
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-50`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={feature.link}>
                      시작하기
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <p className="text-gray-600">예측 정확도</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <p className="text-gray-600">사용자 수</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <p className="text-gray-600">언제든 이용 가능</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-xl font-bold">내 집 마련 시뮬레이터</h4>
          </div>
          <p className="text-gray-400">
            모든 데이터는 시뮬레이션 목적으로 제공되며, 실제 투자 결정 시에는 전문가와 상담하시기 바랍니다.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
