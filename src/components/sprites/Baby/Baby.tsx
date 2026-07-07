import type { CrawlStyle } from '../../../types/game';
import { SPRITE_SOURCES } from '../../../assets/sprites/spriteSources';

const TAU = Math.PI * 2;

// 不快度がこの値以上で「困り顔＋汗」相当の表情に切り替える（SPEC_confirmed.md 準拠）
const WORRIED_MOOD = 0.8;

// 静止画では表情を差し替えられないため、青ざめ＋汗の滲みをフィルタで表現する
const WORRIED_FILTER =
  'saturate(.85) brightness(.96) hue-rotate(10deg) drop-shadow(0 1px 5px rgba(110,170,255,.85))';

const moodFilter = (worried: boolean): string =>
  worried ? WORRIED_FILTER : 'none';

const babySrc = (variant: 'game' | 'title', play: boolean): string => {
  if (variant === 'title') {
    return SPRITE_SOURCES.babyTitle;
  }
  if (play) {
    return SPRITE_SOURCES.babyPlay;
  }
  return SPRITE_SOURCES.babyCrawl;
};

type BabyProps = {
  phase?: number;
  crawlStyle?: CrawlStyle;
  bounce?: number;
  mood?: number;
  play?: boolean;
  size?: number;
  variant?: 'game' | 'title';
};

type Limbs = {
  bob: number;
  sway: number;
  tilt: number;
};

const crawlLimbs = (style: CrawlStyle, a: number, bounce: number): Limbs => {
  if (style === 'bunny') {
    const hop = Math.max(0, Math.sin(a));
    return {
      bob: -(hop ** 1.4) * (bounce * 2),
      sway: 0,
      tilt: 0,
    };
  }
  if (style === 'wiggle') {
    return {
      bob: -Math.abs(Math.sin(a * 2)) * bounce * 0.5,
      sway: Math.sin(a) * 8,
      tilt: Math.sin(a) * 5,
    };
  }
  // diagonal: 左右の手足を交互に出すクロスクロールを、bob と逆位相の sway/tilt で表現する
  return {
    bob: -Math.abs(Math.sin(a * 2)) * bounce,
    sway: Math.sin(a) * 2,
    tilt: Math.sin(a) * 1.5,
  };
};

export function Baby({
  phase = 0,
  crawlStyle = 'diagonal',
  bounce = 7,
  mood = 0,
  play = false,
  size = 120,
  variant = 'game',
}: BabyProps) {
  const a = (phase % 1) * TAU;
  const limbs = crawlLimbs(crawlStyle, a, bounce);
  let { bob, sway, tilt } = limbs;

  if (play) {
    bob = -3 + Math.sin(a * 4) * 3;
    sway = 0;
    tilt = 0;
  }

  // 不快度80%以上は困り顔＋汗の表情へ切替（目がチカチカするため小刻みな震えは入れず、
  // 表情フィルタ＝WORRIED_FILTER のみで表現する）
  const worried = !play && mood >= WORRIED_MOOD;

  return (
    <img
      src={babySrc(variant, play)}
      alt=""
      draggable={false}
      width={size}
      height={size * 1.18}
      style={{
        display: 'block',
        objectFit: 'contain',
        // ドラッグ操作を Stage に通すため画像をヒットテストから除外する
        pointerEvents: 'none',
        transform: `translate(${sway}px, ${bob}px) rotate(${tilt}deg)`,
        filter: moodFilter(worried),
      }}
    />
  );
}
