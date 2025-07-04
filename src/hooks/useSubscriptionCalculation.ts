import { generateMockRecommendations } from '@/mocks/subscriptionData';
import type { EligibilityResult, Recommendation } from '@/types/subscription';

interface FormData {
  householdPeriod: string;
  dependents: string;
  subscriptionPeriod: string;
  marriagePeriod: string;
  monthlyIncome: string;
  totalAssets: string;
  age: string;
  taxPaymentPeriod: string;
  childrenCount: string;
  parentSupportPeriod: string;
}

export const useSubscriptionCalculation = () => {
  const calculateGeneralScore = (formData: FormData) => {
    let score = 0;

    // 무주택 기간 점수 (최대 32점)
    const householdYears = parseInt(formData.householdPeriod) || 0;
    let householdScore = 0;
    if (householdYears >= 15) householdScore = 32;
    else if (householdYears >= 10) householdScore = 28;
    else if (householdYears >= 5) householdScore = 24;
    else if (householdYears >= 2) householdScore = 20;
    else householdScore = 16;

    score += householdScore;

    // 부양가족 점수 (최대 35점)
    const dependentsCount = parseInt(formData.dependents) || 0;
    let dependentsScore = 5; // 기본점수
    if (dependentsCount >= 6) dependentsScore = 35;
    else if (dependentsCount >= 4) dependentsScore = 30;
    else if (dependentsCount >= 3) dependentsScore = 25;
    else if (dependentsCount >= 2) dependentsScore = 20;
    else if (dependentsCount >= 1) dependentsScore = 15;

    score += dependentsScore;

    // 청약통장 가입기간 점수 (최대 17점)
    const subscriptionYears = parseInt(formData.subscriptionPeriod) || 0;
    let subscriptionScore = 0;
    if (subscriptionYears >= 15) subscriptionScore = 17;
    else if (subscriptionYears >= 10) subscriptionScore = 15;
    else if (subscriptionYears >= 5) subscriptionScore = 12;
    else if (subscriptionYears >= 2) subscriptionScore = 10;
    else subscriptionScore = 5;

    score += subscriptionScore;

    return {
      total: score,
      breakdown: {
        household: householdScore,
        dependents: dependentsScore,
        subscription: subscriptionScore,
      },
    };
  };

  const checkEligibility = (
    type: string,
    formData: FormData
  ): EligibilityResult => {
    const householdYears = parseInt(formData.householdPeriod) || 0;
    const subscriptionYears = parseInt(formData.subscriptionPeriod) || 0;

    switch (type) {
      case 'general_first':
        return {
          eligible: subscriptionYears >= 2,
          reasons:
            subscriptionYears < 2 ? ['청약통장 가입기간이 2년 미만입니다'] : [],
        };

      case 'newlywed': {
        const marriageYears = parseInt(formData.marriagePeriod) || 0;
        const monthlyIncome = parseInt(formData.monthlyIncome) || 0;
        const totalAssets = parseInt(formData.totalAssets) || 0;

        const reasons = [];
        if (marriageYears > 7) reasons.push('혼인기간이 7년을 초과했습니다');
        if (householdYears === 0) reasons.push('무주택세대주가 아닙니다');
        if (monthlyIncome > 700) reasons.push('소득기준을 초과했습니다'); // 임시 기준
        if (totalAssets > 36100) reasons.push('자산기준을 초과했습니다'); // 임시 기준

        return {
          eligible:
            marriageYears <= 7 &&
            householdYears > 0 &&
            monthlyIncome <= 700 &&
            totalAssets <= 36100,
          reasons,
        };
      }

      case 'first_life': {
        const age = parseInt(formData.age) || 0;
        const taxYears = parseInt(formData.taxPaymentPeriod) || 0;

        const firstLifeReasons = [];
        if (age < 30) firstLifeReasons.push('연령이 만 30세 미만입니다');
        if (taxYears < 5)
          firstLifeReasons.push('소득세 납부기간이 5년 미만입니다');
        if (householdYears === 0)
          firstLifeReasons.push('무주택세대주가 아닙니다');

        return {
          eligible: age >= 30 && taxYears >= 5 && householdYears > 0,
          reasons: firstLifeReasons,
        };
      }

      case 'multi_child': {
        const childrenCount = parseInt(formData.childrenCount) || 0;

        return {
          eligible: childrenCount >= 3 && householdYears > 0,
          reasons:
            childrenCount < 3
              ? ['만 19세 미만 자녀가 3명 미만입니다']
              : householdYears === 0
              ? ['무주택세대주가 아닙니다']
              : [],
        };
      }

      case 'old_parent': {
        const supportYears = parseInt(formData.parentSupportPeriod) || 0;

        return {
          eligible:
            supportYears >= 3 && subscriptionYears >= 1 && householdYears > 0,
          reasons:
            supportYears < 3
              ? ['노부모 부양기간이 3년 미만입니다']
              : subscriptionYears < 1
              ? ['청약통장 가입기간이 1년 미만입니다']
              : householdYears === 0
              ? ['무주택세대주가 아닙니다']
              : [],
        };
      }

      default:
        return { eligible: true, reasons: [] };
    }
  };

  const calculateScore = (selectedType: string, formData: FormData) => {
    const eligibility = checkEligibility(selectedType, formData);

    if (!eligibility.eligible) {
      return {
        score: null,
        eligibility,
        breakdown: null,
      };
    }

    let score = 0;
    let breakdown = {};

    if (selectedType === 'general_first' || selectedType === 'general_second') {
      const result = calculateGeneralScore(formData);
      score = result.total;
      breakdown = result.breakdown;
    } else {
      // 특별공급의 경우 기본 가점 + 특별 가점
      const baseResult = calculateGeneralScore(formData);
      score = Math.min(baseResult.total, 65); // 특별공급은 일반공급보다 낮은 점수
      breakdown = baseResult.breakdown;
    }

    return {
      score,
      eligibility,
      breakdown,
    };
  };

  const generateRecommendations = (
    score: number,
    type: string
  ): Recommendation[] => {
    return generateMockRecommendations(score, type);
  };

  return {
    calculateScore,
    generateRecommendations,
  };
};
