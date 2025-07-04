import { createMockLoanProducts } from '@/mocks/loanData';
import type { LoanProduct } from '@/types/loan';

interface FormData {
  housePrice: string;
  monthlyIncome: string;
  existingLoan: string;
  age: string;
  deposit: string;
  workExperience: string;
  jobType: string;
  firstHome: string;
  marriageStatus: string;
  children: string;
}

interface SimulationSettings {
  term: string;
  repaymentType: string;
}

export const useLoanCalculation = (
  formatCurrency: (value: string) => string
) => {
  // DSR/DTI 계산 함수
  const calculateDSR = (
    monthlyIncome: number,
    existingLoan: number,
    newLoanPayment: number
  ) => {
    const monthlyDebt = (existingLoan * 10000) / 12 + newLoanPayment;
    return (monthlyDebt / (monthlyIncome * 10000)) * 100;
  };

  const calculateDTI = (annualIncome: number, loanAmount: number) => {
    const annualInterest = loanAmount * 0.04; // 평균 4% 가정
    return (annualInterest / annualIncome) * 100;
  };

  // 금리 계산 함수
  const calculateFinalRate = (
    baseRate: number,
    formData: {
      jobType: string;
      firstHome: string;
      marriageStatus: string;
      age: string;
      children: string;
    }
  ) => {
    let finalRate = baseRate;

    // 신용도 가산금리 (직업군별)
    if (formData.jobType === 'public') finalRate -= 0.2;
    else if (formData.jobType === 'large_company') finalRate -= 0.1;
    else if (formData.jobType === 'small_business') finalRate += 0.3;
    else if (formData.jobType === 'freelancer') finalRate += 0.5;

    // 생애최초 우대
    if (formData.firstHome === 'yes') finalRate -= 0.2;

    // 신혼부부 우대
    if (formData.marriageStatus === 'married' && parseInt(formData.age) < 40)
      finalRate -= 0.2;

    // 다자녀 우대
    if (parseInt(formData.children) >= 2) finalRate -= 0.3;
    else if (parseInt(formData.children) >= 1) finalRate -= 0.1;

    return Math.max(finalRate, 1.0); // 최저 1% 보장
  };

  // 소득 한도 조회
  const getIncomeLimit = (loanId: string): number | null => {
    const limits: Record<string, number> = {
      stepping_stone: 80000000,
      bogeumjari: 70000000,
      jeonse_loan: 50000000,
      youth_loan: 70000000,
    };
    return limits[loanId] || null;
  };

  // 월 상환액 계산
  const calculateMonthlyPayment = (
    amount: number,
    monthlyRate: number,
    months: number,
    type: string
  ): number => {
    if (monthlyRate === 0) return amount / months;

    switch (type) {
      case 'equal_payment': // 원리금균등상환
        return (
          (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
        );
      case 'equal_principal': // 원금균등상환 (첫 회차)
        return amount / months + amount * monthlyRate;
      case 'bullet': // 만기일시상환
        return amount * monthlyRate;
      default:
        return (
          (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
        );
    }
  };

  const calculateLoan = (
    formData: FormData,
    simulationSettings: SimulationSettings
  ): LoanProduct[] => {
    const housePrice = parseInt(formData.housePrice) * 10000 || 0;
    const monthlyIncome = parseInt(formData.monthlyIncome) * 10000 || 0;
    const annualIncome = monthlyIncome * 12;
    const existingLoan = parseInt(formData.existingLoan) * 10000 || 0;
    const age = parseInt(formData.age) || 25;
    const deposit = parseInt(formData.deposit) * 10000 || 0;

    const loanProducts = createMockLoanProducts(housePrice, deposit);

    // 자격 조건 및 대출 한도 계산
    loanProducts.forEach((loan) => {
      // 최종 금리 계산
      loan.finalRate = calculateFinalRate(
        loan.baseRate + loan.additionalRate,
        formData
      );

      // 자격 조건 검증
      let eligible = true;
      let reason = '';

      // 나이 조건
      if (loan.id === 'youth_loan' && age > 34) {
        eligible = false;
        reason = '나이 조건 미충족 (34세 이하)';
      }

      // 소득 조건
      const annualIncomeLimit = getIncomeLimit(loan.id);
      if (annualIncomeLimit && annualIncome > annualIncomeLimit) {
        eligible = false;
        reason = `소득 조건 미충족 (연 ${formatCurrency(
          (annualIncomeLimit / 10000).toString()
        )} 이하)`;
      }

      // 무주택 조건
      if (
        (loan.id === 'bogeumjari' || loan.id === 'jeonse_loan') &&
        formData.firstHome === 'no'
      ) {
        eligible = false;
        reason = '무주택자 조건 미충족';
      }

      // 신혼부부/다자녀 조건
      if (loan.id === 'stepping_stone') {
        const isMarried = formData.marriageStatus === 'married';
        const hasChildren = parseInt(formData.children) >= 2;
        const isFirstHome = formData.firstHome === 'yes';

        if (!isMarried && !hasChildren) {
          eligible = false;
          reason = '신혼부부 또는 2자녀 이상 조건 미충족';
        }
        if (!isFirstHome) {
          eligible = false;
          reason = '생애최초 주택구입 조건 미충족';
        }
      }

      // DSR/DTI 검증
      if (eligible && loan.maxAmount > 0) {
        const monthlyRate = loan.finalRate / 100 / 12;
        const months = parseInt(simulationSettings.term) * 12;
        const monthlyPayment = calculateMonthlyPayment(
          loan.maxAmount,
          monthlyRate,
          months,
          simulationSettings.repaymentType
        );

        const dsr = calculateDSR(
          monthlyIncome / 10000,
          existingLoan / 10000,
          monthlyPayment
        );
        const dti = calculateDTI(annualIncome, loan.maxAmount);

        if (dsr > loan.maxDSR) {
          eligible = false;
          reason = `DSR 초과 (${dsr.toFixed(1)}% > ${loan.maxDSR}%)`;
        } else if (dti > loan.maxDTI) {
          eligible = false;
          reason = `DTI 초과 (${dti.toFixed(1)}% > ${loan.maxDTI}%)`;
        }

        if (eligible) {
          loan.monthlyPayment = monthlyPayment;
          loan.totalInterest = monthlyPayment * months - loan.maxAmount;
          loan.guaranteeFee = loan.maxAmount * 0.003; // 보증료 0.3% 가정
        }
      }

      loan.eligible = eligible;
      loan.eligibilityReason = reason;
    });

    return loanProducts;
  };

  return {
    calculateLoan,
  };
};
