export interface RegionInfo {
  name: string;
  averagePrice: string;
  priceChange: string;
  matchScore: number;
  coordinates: { lat: number; lng: number };

  // 세분화된 평가 항목들
  scores: {
    education: number; // 교육환경
    transport: number; // 교통편의
    infrastructure: number; // 생활인프라
    safety: number; // 치안/안전
    environment: number; // 환경/자연
    culture: number; // 문화/여가
    commercial: number; // 상업시설
    medical: number; // 의료시설
    lifestyle: number; // 생활편의
    community: number; // 커뮤니티/이웃
  };

  // 상세 정보
  details: {
    schools: string[];
    hospitals: string[];
    shopping: string[];
    restaurants: string[];
    parks: string[];
    cultural: string[];
    transport: string[];
    safety: string[];
  };

  highlights: string[];
  priceAnalysis: {
    futureProspect: string;
    developmentPlan: string[];
    marketTrend: string;
  };
}

export type ScoreCategory = keyof RegionInfo['scores'];

export interface RegionPreferences {
  budget: string;
  familySize: string;
  childAge: string;
  workLocation: string;
  priority: string;
  transportType: string;
  lifestyle: string;
}
