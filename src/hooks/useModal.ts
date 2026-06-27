import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { useDisclosure } from './useDisclosure';

type Modal = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  dialogRef: RefObject<HTMLDivElement | null>;
};

// ダイアログ内で最初にフォーカスする操作要素を探すためのセレクタ
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// モーダルダイアログの開閉とフォーカス制御を集約するフック。
// 開いたらダイアログ内へフォーカスを移し、Escで閉じ、閉じたら開く前の要素へ
// フォーカスを戻す。背景の非活性化（inert 付与）は呼び出し側で行う前提で、
// 本フックはフォーカスの閉じ込め・復帰と Esc 終了のみを担う。
export const useModal = (): Modal => {
  const { isOpen, open: openBase, close } = useDisclosure();
  const dialogRef = useRef<HTMLDivElement>(null);
  // 開く直前のフォーカス要素。閉じたときの復帰先に使う（inert 付与前に捕捉する）。
  const openerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    openBase();
  }, [openBase]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    // 開いたらダイアログ内の最初の操作要素へフォーカスを移す（背景は inert）。
    const panel = dialogRef.current;
    const focusable = panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (focusable ?? panel)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // 閉じる際（inert 解除後の片付け）に、開く前のフォーカス要素へ戻す。
      const opener = openerRef.current;
      openerRef.current = null;
      if (opener?.isConnected) {
        opener.focus();
      }
    };
  }, [isOpen, close]);

  return { isOpen, open, close, dialogRef };
};
