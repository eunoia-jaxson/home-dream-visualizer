import { Building, Users, Heart, Home } from 'lucide-react';

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export interface Recommendation {
  name: string;
  location: string;
  type: string;
  subscriptionType: string;
  minScore: number;
  competition: string;
  price: string;
  canApply: boolean;
}

// 청약 유형별 설명 데이터
export const subscriptionTypes = {
  general_first: {
    name: '일반공급 1순위 (가점제)',
    icon: Building,
    description:
      '무주택기간, 부양가족 수, 청약통장 가입기간을 합산하여 가점이 높은 순으로 당첨',
    requirements: [
      '무주택세대주 또는 세대원',
      '청약통장 가입 2년 이상',
      '85㎡ 이하는 1순위자 중 가점제(40%) + 추첨제(60%)',
      '85㎡ 초과는 1순위자 중 추첨제(100%)',
    ],
    maxScore: 84,
  },
  general_second: {
    name: '일반공급 2순위',
    icon: Users,
    description: '1순위 조건에 해당하지 않는 경우, 추첨으로 당첨자 선정',
    requirements: [
      '청약통장 가입자 중 1순위가 아닌 경우',
      '100% 추첨제로 선정',
    ],
    maxScore: 0,
  },
  newlywed: {
    name: '신혼부부 특별공급',
    icon: Heart,
    description:
      '혼인 7년 이내 무주택 신혼부부 대상, 소득 및 자산 기준 충족 시 신청 가능',
    requirements: [
      '혼인신고일로부터 7년 이내',
      '무주택세대주',
      '부부합산 월평균소득이 전년도 도시근로자 가구원수별 가구당 월평균소득의 140% 이하',
      '총자산 3.61억원 이하, 자동차 3,557만원 이하',
    ],
    maxScore: 75,
  },
  first_life: {
    name: '생애최초 특별공급',
    icon: Home,
    description:
      '생애최초로 주택을 구입하는 무주택세대주, 소득 및 자산 기준 충족 시 신청 가능',
    requirements: [
      '세대주를 포함하여 세대원 전원이 과거 주택을 소유한 사실이 없는 자',
      '세대주 연령 만 40세 이상 (단, 배우자가 있는 경우 만 30세 이상)',
      '5년 이상 소득세 납부',
      '월평균소득이 전년도 도시근로자 가구원수별 가구당 월평균소득의 130% 이하',
    ],
    maxScore: 75,
  },
  multi_child: {
    name: '다자녀가구 특별공급',
    icon: Users,
    description: '만 19세 미만 자녀 3명 이상을 양육하는 무주택세대주',
    requirements: [
      '만 19세 미만 자녀 3명 이상',
      '무주택세대주',
      '당첨자 선정 기준: 미성년 자녀 수, 세대구성(3세대 이상), 무주택기간, 해당 시·도 거주기간 순',
    ],
    maxScore: 75,
  },
  old_parent: {
    name: '노부모부양 특별공급',
    icon: Heart,
    description: '만 65세 이상 직계존속을 3년 이상 부양하는 무주택세대주',
    requirements: [
      '만 65세 이상 직계존속을 3년 이상 계속 부양',
      '무주택세대주',
      '청약통장 가입 1년 이상',
    ],
    maxScore: 75,
  },
};

export const generateMockRecommendations = (
  score: number,
  type: string
): Recommendation[] => {
  const mockRecommendations = [
    {
      name: '힐스테이트 송도',
      location: '인천 연수구',
      type: '민간분양',
      subscriptionType: '일반공급',
      minScore: 45,
      competition: '3.2:1',
      price: '4억 5천만원',
      canApply:
        score >= 45 && (type.includes('general') || type === 'newlywed'),
    },
    {
      name: '래미안 위브',
      location: '경기 성남시',
      type: '민간분양',
      subscriptionType: '특별공급',
      minScore: 40,
      competition: '2.8:1',
      price: '5억 2천만원',
      canApply: score >= 40 && !type.includes('general'),
    },
    {
      name: '푸르지오 센트럴파크',
      location: '서울 노원구',
      type: '민간분양',
      subscriptionType: '일반공급',
      minScore: 55,
      competition: '8.3:1',
      price: '6억 8천만원',
      canApply: score >= 55 && type.includes('general'),
    },
    {
      name: '신혼희망타운',
      location: '경기 화성시',
      type: '공공분양',
      subscriptionType: '신혼부부특별공급',
      minScore: 30,
      competition: '1.5:1',
      price: '3억 2천만원',
      canApply: score >= 30 && type === 'newlywed',
    },
  ];

  return mockRecommendations.filter((item) => item.canApply);
};
