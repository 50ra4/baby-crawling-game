import type { Contact, GameConfig, PlayStyle } from '../../types/game';

// 遊ぶ演出（playStyle）ごとの変形。k は接触の進行度0..1。
const PLAY_TRANSFORM: Record<PlayStyle, (k: number) => string> = {
  sit: (k) => `rotate(${Math.sin(k * Math.PI * 4) * 10}deg)`,
  bounce: (k) => `translateY(${-Math.abs(Math.sin(k * Math.PI * 3)) * 16}px)`,
  spin: (k) => `rotate(${k * 360}deg)`,
};

// 接触中の赤ちゃんに重ねる変形を返す。接触がなければ空文字。
export const babyContactTransform = (
  contact: Contact | null,
  config: GameConfig,
): string => {
  if (!contact) {
    return '';
  }
  const k = contact.t / contact.dur;
  return PLAY_TRANSFORM[config.playStyle](k);
};
