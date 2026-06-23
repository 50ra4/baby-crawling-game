import type { Popup } from '../types/game';

const POPUP_LIFETIME = 1.1;

// 全ポップアップの経過時間を進め、寿命切れを除去する。
export const updatePopups = (popups: Popup[], dt: number): Popup[] =>
  popups
    .map((popup) => ({ ...popup, t: popup.t + dt }))
    .filter((popup) => popup.t < POPUP_LIFETIME);

// 新しいポップアップを追加した配列を返す（元配列は変更しない）。
export const addPopup = (
  popups: Popup[],
  id: number,
  text: string,
  color: string,
  x: number,
  y: number,
): Popup[] => [...popups, { id, text, color, x, y, t: 0 }];
