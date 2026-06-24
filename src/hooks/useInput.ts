import { useEffect, useRef, type PointerEvent, type RefObject } from 'react';
import type { InputState } from '../types/game';
import { MARGIN, STAGE_WIDTH } from '../constants/gameConfig';
import { clamp } from '../utils/math';

const LEFT_KEYS = ['ArrowLeft', 'a', 'A'];
const RIGHT_KEYS = ['ArrowRight', 'd', 'D'];
const CONFIRM_KEYS = [' ', 'Enter'];

// テキスト入力中（名前入力欄など）はゲーム操作キーを無視するための判定。
// input/textarea/select やcontenteditableにフォーカスがある場合は true。
const isTextInputTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
};

type PointerInput = {
  inputRef: RefObject<InputState>;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
};

// キーボード（←→/AD・Space/Enter）とポインタ（ドラッグ）入力を集約する。
// 入力はReactの状態ではなくrefに保持し、再レンダリングを起こさない。
export const useInput = (
  stageRef: RefObject<HTMLDivElement | null>,
  playing: boolean,
  onConfirm: () => void,
): PointerInput => {
  const inputRef = useRef<InputState>({
    left: false,
    right: false,
    dragging: false,
    targetX: STAGE_WIDTH / 2,
  });
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }
      // IME変換中（Enter確定など）やテキスト入力中は、開始・移動操作を無視する。
      if (event.isComposing || isTextInputTarget(event.target)) {
        return;
      }
      if (LEFT_KEYS.includes(event.key)) {
        inputRef.current = { ...inputRef.current, left: true };
      } else if (RIGHT_KEYS.includes(event.key)) {
        inputRef.current = { ...inputRef.current, right: true };
      } else if (CONFIRM_KEYS.includes(event.key)) {
        onConfirmRef.current();
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (LEFT_KEYS.includes(event.key)) {
        inputRef.current = { ...inputRef.current, left: false };
      } else if (RIGHT_KEYS.includes(event.key)) {
        inputRef.current = { ...inputRef.current, right: false };
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const pointerToLogical = (clientX: number): number => {
    const el = stageRef.current;
    if (!el) {
      return STAGE_WIDTH / 2;
    }
    const rect = el.getBoundingClientRect();
    const logical = ((clientX - rect.left) / rect.width) * STAGE_WIDTH;
    return clamp(logical, MARGIN, STAGE_WIDTH - MARGIN);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!playingRef.current) {
      return;
    }
    inputRef.current = {
      ...inputRef.current,
      dragging: true,
      targetX: pointerToLogical(event.clientX),
    };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (inputRef.current.dragging) {
      inputRef.current = {
        ...inputRef.current,
        targetX: pointerToLogical(event.clientX),
      };
    }
  };
  const onPointerUp = () => {
    inputRef.current = { ...inputRef.current, dragging: false };
  };

  return { inputRef, onPointerDown, onPointerMove, onPointerUp };
};
