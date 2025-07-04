// 대출 시뮬레이션 데이터
export { createMockLoanProducts } from './loanData';

// 자산 시뮬레이션 데이터
export { scenarios } from './assetData';

// 청약 계산기 데이터
export {
  subscriptionTypes,
  generateMockRecommendations,
} from './subscriptionData';

// 지역 추천 데이터
export { mockRegionRecommendations } from './regionData';

// 타입들은 types 폴더에서 re-export
export type {
  LoanProduct,
  SimulationData as LoanSimulationData,
} from '@/types/loan';

export type {
  ScenarioConfig,
  SimulationData as AssetSimulationData,
  ScenarioData,
} from '@/types/asset';

export type {
  EligibilityResult,
  Recommendation,
  SubscriptionType,
  SubscriptionTypeKey,
} from '@/types/subscription';

export type {
  RegionInfo,
  ScoreCategory,
  RegionPreferences,
} from '@/types/region';
