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

// ボタン・リンク等のインタラクティブ要素にフォーカスがある場合の判定。
// Space/Enter はその要素本来の活性化キーなので、確定（開始）は要素自身の
// クリックに任せ、window 側では二重に発火させない（性別・あそびかた等のボタン）。
const isInteractiveTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return target.closest('button, a[href], [role="button"]') !== null;
};

// モーダル（あそびかたダイアログ等）の表示中かどうか。表示中は背後の
// ゲーム開始を抑止し、ダイアログ操作中の意図しない開始を防ぐ。
const isModalOpen = (): boolean =>
  document.querySelector('[aria-modal="true"]') !== null;

type PointerInput = {
  inputRef: RefObject<InputState>;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
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
    targetX: null,
  });
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;
  const playingRef = useRef(playing);
  playingRef.current = playing;
  // ポインタ押下中（ドラッグ中）かどうか。これが true の間だけ移動目標を更新し、
  // ボタン未押下のホバー移動では目標を書き換えない。
  const draggingRef = useRef(false);

  // 新しいプレイ開始時に前回ドラッグの残存目標をクリアし、開始直後に古い位置へ
  // 滑り出すのを防ぐ（外部状態 playing との同期）。
  useEffect(() => {
    if (playing) {
      draggingRef.current = false;
      inputRef.current = { ...inputRef.current, targetX: null };
    }
  }, [playing]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }
      // IME変換中（Enter確定など）やテキスト入力中は、開始・移動操作を無視する。
      if (event.isComposing || isTextInputTarget(event.target)) {
        return;
      }
      // キー操作を始めたらタップ/ドラッグの追従目標をクリアし、キー入力へ切り替える
      // （指を離した後の意図しないタップ位置への追従ドリフトを防ぐ）。
      if (LEFT_KEYS.includes(event.key)) {
        inputRef.current = { ...inputRef.current, left: true, targetX: null };
      } else if (RIGHT_KEYS.includes(event.key)) {
        inputRef.current = { ...inputRef.current, right: true, targetX: null };
      } else if (CONFIRM_KEYS.includes(event.key)) {
        // ボタン等にフォーカス中、またはモーダル表示中は確定（開始）させない。
        // キーボード操作で性別選択やダイアログを触ると即ゲーム開始する不具合を防ぐ。
        if (isInteractiveTarget(event.target) || isModalOpen()) {
          return;
        }
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

  // タップ/ドラッグで移動目標を設定する。指を離しても目標は保持し、赤ちゃんは
  // そこへ向かって移動を続ける（タップ移動）。targetX は次のタップ・ドラッグや
  // キー操作で更新される。
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!playingRef.current) {
      return;
    }
    draggingRef.current = true;
    // タッチ中に指がStage外へ出ても pointermove を受け取り続けられるよう捕捉する
    event.currentTarget.setPointerCapture?.(event.pointerId);
    inputRef.current = {
      ...inputRef.current,
      targetX: pointerToLogical(event.clientX),
    };
  };
  // 押下中（ドラッグ中）のみ目標を更新する。ボタン未押下のホバー移動では追従しない
  // （マウスで一度クリックした後にカーソルへ追従してしまうのを防ぐ）。
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!playingRef.current || !draggingRef.current) {
      return;
    }
    inputRef.current = {
      ...inputRef.current,
      targetX: pointerToLogical(event.clientX),
    };
  };
  // ドラッグ終了。タップ移動のため targetX は保持し、以後の追従だけを止める。
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return { inputRef, onPointerDown, onPointerMove, onPointerUp };
};
