import { useCallback, useState } from 'react';

type Disclosure = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

// 開閉トグル状態。モーダル/ダイアログの表示制御に使う（状態はフックへ集約する）。
export const useDisclosure = (initial = false): Disclosure => {
  const [isOpen, setIsOpen] = useState(initial);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return { isOpen, open, close };
};
