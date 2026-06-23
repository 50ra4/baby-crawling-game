import type {
  Contact,
  GameConfig,
  HurtStyle,
  PlayStyle,
} from '../../types/game';

// 被弾演出（hurtStyle）ごとの赤ちゃんのCSS変形。k は接触の進行度0..1。
const HURT_TRANSFORM: Record<HurtStyle, (k: number) => string> = {
  flash: (k) => `translateX(${Math.sin(k * Math.PI * 6) * 6}px)`,
  tumble: (k) => `rotate(${Math.sin(k * Math.PI * 3) * 22}deg)`,
  squash: (k) => {
    const s = 1 - Math.sin(k * Math.PI) * 0.22;
    return `scale(${1 + (1 - s) * 0.4}, ${s})`;
  },
};

// 遊ぶ演出（playStyle）ごとの変形
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
  return contact.type === 'hurt'
    ? HURT_TRANSFORM[config.hurtStyle](k)
    : PLAY_TRANSFORM[config.playStyle](k);
};
