import { useCallback } from 'react';

export const useCurrency = () => {
  // 만원 단위를 읽기 쉬운 형태로 변환하는 함수
  const formatCurrency = useCallback((amount: string | number) => {
    const num = typeof amount === 'string' ? parseInt(amount) : amount;
    if (!num || num === 0) return '';

    if (num >= 100000000) {
      // 1조 이상 (100,000,000만원 = 1조)
      const jo = Math.floor(num / 100000000);
      const remainder = num % 100000000;

      if (remainder === 0) {
        return `${jo}조원`;
      } else if (remainder >= 10000) {
        const eok = Math.floor(remainder / 10000);
        const eokRemainder = remainder % 10000;
        if (eokRemainder === 0) {
          return `${jo}조 ${eok}억원`;
        } else {
          return `${jo}조 ${eok}억 ${eokRemainder}만원`;
        }
      } else {
        return `${jo}조 ${remainder}만원`;
      }
    } else if (num >= 10000) {
      // 1억 이상
      const eok = Math.floor(num / 10000);
      const remainder = num % 10000;

      if (remainder === 0) {
        return `${eok}억원`;
      } else if (remainder >= 1000) {
        const thousand = Math.floor(remainder / 1000);
        const remaining = remainder % 1000;
        if (remaining === 0) {
          return `${eok}억 ${thousand}천만원`;
        } else {
          return `${eok}억 ${remainder}만원`;
        }
      } else {
        return `${eok}억 ${remainder}만원`;
      }
    } else if (num >= 1000) {
      // 1천만 이상
      const thousand = Math.floor(num / 1000);
      const remainder = num % 1000;
      if (remainder === 0) {
        return `${thousand}천만원`;
      } else {
        return `${thousand}천 ${remainder}만원`;
      }
    } else {
      return `${num}만원`;
    }
  }, []);

  // 숫자를 천 단위로 구분하여 표시
  const formatNumber = useCallback((num: number) => {
    return num.toLocaleString();
  }, []);

  // 금액을 간단한 형태로 표시 (예: 1.2억)
  const formatCurrencyShort = useCallback((amount: string | number) => {
    const num = typeof amount === 'string' ? parseInt(amount) : amount;
    if (!num || num === 0) return '';

    if (num >= 100000000) {
      const jo = num / 100000000;
      return `${jo.toFixed(1)}조`;
    } else if (num >= 10000) {
      const eok = num / 10000;
      return `${eok.toFixed(1)}억`;
    } else if (num >= 1000) {
      const thousand = num / 1000;
      return `${thousand.toFixed(1)}천만`;
    } else {
      return `${num}만원`;
    }
  }, []);

  return {
    formatCurrency,
    formatNumber,
    formatCurrencyShort,
  };
};
