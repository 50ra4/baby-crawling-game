import type { CSSProperties } from 'react';
import type { Theme } from '../../types/game';

// テーマごとの背景を生成する。スクロール量でループ位置を進める。
const BACKGROUND_BUILDERS: Record<Theme, (scroll: number) => string> = {
  park: (scroll) => {
    const y = `${scroll % 240}px`;
    return `radial-gradient(circle at 22% 12%, #ffffff66 2px, transparent 3px) 0 ${y}/64px 84px,
      radial-gradient(circle at 68% 52%, #ffd9ec88 3px, transparent 4px) 0 ${y}/92px 122px,
      radial-gradient(circle at 88% 80%, #fff6b088 2.5px, transparent 4px) 0 ${y}/120px 150px,
      linear-gradient(#bfe3a0, #a6d585)`;
  },
  night: (scroll) =>
    `radial-gradient(circle at 30% 20%, #fff 1px, transparent 2px) 0 ${scroll % 160}px/70px 90px,
      radial-gradient(circle at 80% 60%, #fdf6c9 1.5px, transparent 2.5px) 0 ${scroll % 200}px/110px 130px,
      radial-gradient(circle at 55% 90%, #cdd6ff 1.5px, transparent 2.5px) 0 ${scroll % 240}px/150px 170px,
      linear-gradient(#2c3168, #191d45)`,
  room: (scroll) => {
    const y = `${scroll % 150}px`;
    return `repeating-linear-gradient(0deg, rgba(90,55,20,.16) 0 2px, transparent 2px 150px) 0 ${y}/100% 150px,
      repeating-linear-gradient(0deg, rgba(255,240,210,.10) 0 1px, transparent 1px 9px) 0 ${y}/100% 150px,
      repeating-linear-gradient(90deg, rgba(120,80,40,.20) 0 2px, transparent 2px 60px) 0 0/60px 100%,
      repeating-linear-gradient(90deg, #d8a667 0 60px, #cf9b58 60px 120px) 0 0/120px 100%`;
  },
};

// 中央1/3の「ランナー」帯の模様
const CENTER_RUNNER: Record<Theme, string> = {
  park: 'repeating-linear-gradient(0deg, #ece0c6 0 22px, #e4d6b6 22px 44px)',
  night: 'linear-gradient(rgba(255,247,200,.34), rgba(255,247,200,.16))',
  room: 'linear-gradient(90deg, transparent 0 6%, #e7b9c9 6% 9%, #f3e3cf 9% 91%, #e7b9c9 91% 94%, transparent 94%)',
};

export const backgroundStyle = (theme: Theme, scroll: number): CSSProperties => ({
  background: BACKGROUND_BUILDERS[theme](scroll),
});

export const centerRunnerStyle = (theme: Theme): CSSProperties => ({
  background: CENTER_RUNNER[theme],
});
