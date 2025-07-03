import { useMemo } from 'react';

interface EncouragementMessage {
  message: string;
  color: string;
  icon: string;
}

interface ProgressConfig {
  formData: Record<string, string>;
  requiredFields: string[];
  encouragementMessages?: {
    start: EncouragementMessage;
    progress30: EncouragementMessage;
    progress70: EncouragementMessage;
    nearComplete: EncouragementMessage;
    complete: EncouragementMessage;
  };
}

const defaultEncouragementMessages = {
  start: {
    message: '시작이 반이에요! 첫 번째 정보를 입력해보세요 🚀',
    color: 'text-blue-600',
    icon: '💪',
  },
  progress30: {
    message: '좋은 시작이에요! 계속 진행해보세요 ✨',
    color: 'text-green-600',
    icon: '🌟',
  },
  progress70: {
    message: '절반 넘었어요! 조금만 더 힘내세요 💪',
    color: 'text-blue-600',
    icon: '🎯',
  },
  nearComplete: {
    message: '거의 다 왔어요! 마지막 정보만 입력하면 완료! 🔥',
    color: 'text-purple-600',
    icon: '🚀',
  },
  complete: {
    message: '완벽해요! 이제 분석 결과를 확인해보세요! 🎉',
    color: 'text-green-600',
    icon: '✅',
  },
};

export const useProgress = ({
  formData,
  requiredFields,
  encouragementMessages = defaultEncouragementMessages,
}: ProgressConfig) => {
  const progress = useMemo(() => {
    let filledFields = 0;

    requiredFields.forEach((field) => {
      if (formData[field] && formData[field] !== '') {
        filledFields++;
      }
    });

    return Math.round((filledFields / requiredFields.length) * 100);
  }, [formData, requiredFields]);

  const encouragementMessage = useMemo(() => {
    if (progress === 0) {
      return encouragementMessages.start;
    } else if (progress < 30) {
      return encouragementMessages.progress30;
    } else if (progress < 70) {
      return encouragementMessages.progress70;
    } else if (progress < 100) {
      return encouragementMessages.nearComplete;
    } else {
      return encouragementMessages.complete;
    }
  }, [progress, encouragementMessages]);

  return {
    progress,
    encouragementMessage,
  };
};
