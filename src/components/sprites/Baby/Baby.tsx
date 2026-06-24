import type { CrawlStyle } from '../../../types/game';
import babyCrawlImg from '../../../assets/sprites/baby-crawl.png';
import babyPlayImg from '../../../assets/sprites/baby-play.png';
import babyTitleImg from '../../../assets/sprites/baby-title.png';

const TAU = Math.PI * 2;

type BabyProps = {
  phase?: number;
  crawlStyle?: CrawlStyle;
  bounce?: number;
  skin?: string;
  cloth?: string;
  mood?: number;
  hurt?: boolean;
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
    sway: Math.sin(a) * 4,
    tilt: Math.sin(a) * 3,
  };
};

export function Baby({
  phase = 0,
  crawlStyle = 'diagonal',
  bounce = 7,
  hurt = false,
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

  const src = variant === 'title' ? babyTitleImg : play ? babyPlayImg : babyCrawlImg;

  return (
    <img
      src={src}
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
        filter: hurt
          ? 'drop-shadow(0 0 10px rgba(255,70,70,.95)) hue-rotate(-20deg) saturate(1.5)'
          : 'none',
      }}
    />
  );
}
