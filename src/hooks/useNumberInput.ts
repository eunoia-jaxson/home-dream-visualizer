import { KeyboardEvent, ClipboardEvent } from 'react';

export const useNumberInput = () => {
  // 0 이상의 숫자만 입력 가능하도록 하는 함수
  const handleNumberKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 허용된 키: 숫자(0-9), 백스페이스, 삭제, 탭, 화살표 키, Home, End
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ];

    // 숫자 키 (0-9)와 허용된 키가 아니면 입력 차단
    if (!allowedKeys.includes(e.key) && (e.key < '0' || e.key > '9')) {
      e.preventDefault();
    }

    // 마이너스(-), 플러스(+), 점(.), 'e', 'E' 등 특수문자 차단
    if (['-', '+', '.', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
    }
  };

  // 붙여넣기 시 0 이상의 숫자만 허용
  const handleNumberPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    // 숫자가 아니거나 음수면 붙여넣기 차단
    if (!/^\d+$/.test(pastedText) || parseInt(pastedText) < 0) {
      e.preventDefault();
    }
  };

  return {
    handleNumberKeyDown,
    handleNumberPaste,
  };
};
