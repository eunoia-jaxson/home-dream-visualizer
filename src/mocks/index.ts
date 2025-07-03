// 대출 시뮬레이션 데이터
export { createMockLoanProducts, type LoanProduct } from './loanData';

// 자산 시뮬레이션 데이터
export {
  scenarios,
  type ScenarioConfig,
  type SimulationData,
  type ScenarioData,
} from './assetData';

// 청약 계산기 데이터
export {
  subscriptionTypes,
  generateMockRecommendations,
  type EligibilityResult,
  type Recommendation,
} from './subscriptionData';

// 지역 추천 데이터
export { mockRegionRecommendations, type RegionInfo } from './regionData';
