import type { CSSProperties } from 'react';

// 装飾用スプライト共通スタイル。pointerEvents:'none' で <img> をヒットテストから外し、
// Stage へのドラッグ操作（pointermove/up）を画像がさらわないようにする
export const IMG_SPRITE_STYLE: CSSProperties = {
  display: 'block',
  objectFit: 'contain',
  pointerEvents: 'none',
};
