import { useId } from 'react';
import type { CrawlStyle } from '../../../types/game';
import { shade } from '../../../utils/color';
import { Capsule, type Point } from '../Capsule/Capsule';

const TAU = Math.PI * 2;
const REACH = 8;

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
};

type Limbs = {
  reachArmL: number;
  reachArmR: number;
  reachLegL: number;
  reachLegR: number;
  bob: number;
  sway: number;
  tilt: number;
};

// ハイハイの種類ごとに四肢の振りと体の揺れを決める
const crawlLimbs = (style: CrawlStyle, a: number, bounce: number): Limbs => {
  if (style === 'bunny') {
    const hop = Math.max(0, Math.sin(a));
    return {
      reachArmL: Math.sin(a),
      reachArmR: Math.sin(a),
      reachLegL: Math.sin(a + Math.PI),
      reachLegR: Math.sin(a + Math.PI),
      bob: -(hop ** 1.4) * (bounce * 2),
      sway: 0,
      tilt: 0,
    };
  }
  if (style === 'wiggle') {
    return {
      reachArmL: Math.sin(a) * 0.8,
      reachArmR: Math.sin(a + Math.PI) * 0.8,
      reachLegL: Math.sin(a + Math.PI) * 0.8,
      reachLegR: Math.sin(a) * 0.8,
      bob: -Math.abs(Math.sin(a * 2)) * bounce * 0.5,
      sway: Math.sin(a) * 8,
      tilt: Math.sin(a) * 5,
    };
  }
  // diagonal（既定）：左手＋右膝が交互にリード
  return {
    reachArmL: Math.sin(a),
    reachArmR: Math.sin(a + Math.PI),
    reachLegL: Math.sin(a + Math.PI),
    reachLegR: Math.sin(a),
    bob: -Math.abs(Math.sin(a * 2)) * bounce,
    sway: 0,
    tilt: 0,
  };
};

// カメラから見て後ろ姿でハイハイする赤ちゃん。四肢は2点カプセルで表現。
export function Baby({
  phase = 0,
  crawlStyle = 'diagonal',
  bounce = 7,
  skin = '#ffd9bf',
  cloth = '#ffb3c7',
  mood = 0,
  hurt = false,
  play = false,
  size = 120,
}: BabyProps) {
  const a = (phase % 1) * TAU;
  const id = useId().replace(/:/g, '');
  const skinShade = shade(skin, -0.1);
  const clothShade = shade(cloth, -0.12);
  const hairColor = shade(skin, -0.4);
  const hairDark = shade(skin, -0.5);
  const worried = mood >= 0.8;

  const shoulderL: Point = [-13, -16];
  const shoulderR: Point = [13, -16];
  const hipL: Point = [-12, 14];
  const hipR: Point = [12, 14];

  const limbs = crawlLimbs(crawlStyle, a, bounce);
  let { bob, sway, tilt } = limbs;

  let handL: Point = [-25 - limbs.reachArmL * 3, -50 - limbs.reachArmL * REACH];
  let handR: Point = [25 + limbs.reachArmR * 3, -50 - limbs.reachArmR * REACH];
  let footL: Point = [-20 - limbs.reachLegL * 3, 42 - limbs.reachLegL * REACH];
  let footR: Point = [20 + limbs.reachLegR * 3, 42 - limbs.reachLegR * REACH];

  // 遊ぶポーズ：座って両手を上げて拍手
  if (play) {
    handL = [-20, -52 + Math.sin(a * 3) * 8];
    handR = [20, -52 - Math.sin(a * 3) * 8];
    footL = [-22, 38];
    footR = [22, 38];
    bob = -3 + Math.sin(a * 4) * 3;
    sway = 0;
    tilt = 0;
  }
  const headBob = bob * 0.4;

  return (
    <svg
      width={size}
      height={size * 1.18}
      viewBox="0 0 120 142"
      style={{
        overflow: 'visible',
        display: 'block',
        filter: hurt
          ? 'drop-shadow(0 0 10px rgba(255,70,70,.95)) hue-rotate(-20deg) saturate(1.5)'
          : 'none',
      }}
    >
      <defs>
        <radialGradient id={`cheek${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9bb0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff9bb0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={`translate(${60 + sway} ${76 + bob}) rotate(${tilt})`}>
        <ellipse cx="0" cy="46" rx="33" ry="8.5" fill="rgba(0,0,0,0.10)" />

        {/* 後ろ脚 */}
        <Capsule a={hipL} b={footL} width={14} color={clothShade} cap={skin} sock={cloth} end="foot" />
        <Capsule a={hipR} b={footR} width={14} color={clothShade} cap={skin} sock={cloth} end="foot" />

        {/* ロンパースの胴体 */}
        <path
          d="M-25 4 Q-29 -20 0 -22 Q29 -20 25 4 Q27 30 0 33 Q-27 30 -25 4 Z"
          fill={cloth}
          stroke={clothShade}
          strokeWidth="1.5"
        />
        <path d="M-15 27 Q0 37 15 27 L13 34 Q0 40 -13 34 Z" fill="#fffdf8" stroke="#e9e2d4" strokeWidth="1" />
        <path d="M0 -14 L0 19" stroke={clothShade} strokeWidth="1.2" opacity="0.45" />
        <circle cx="0" cy="-1" r="1.6" fill={clothShade} opacity="0.6" />

        {/* 前腕 */}
        <Capsule a={shoulderL} b={handL} width={12} color={cloth} cap={skin} end="hand" />
        <Capsule a={shoulderR} b={handR} width={12} color={cloth} cap={skin} end="hand" />

        {/* 後頭部（カメラに背を向けてハイハイ） */}
        <g transform={`translate(0 ${-40 + headBob})`}>
          <path
            d="M-23 4 Q-23 -28 0 -30 Q23 -28 23 4 Q23 24 0 26 Q-23 24 -23 4 Z"
            fill={skin}
            stroke={skinShade}
            strokeWidth="1.5"
          />
          <circle cx="-23" cy="3" r="5" fill={skin} stroke={skinShade} strokeWidth="1.2" />
          <circle cx="23" cy="3" r="5" fill={skin} stroke={skinShade} strokeWidth="1.2" />
          <path
            d="M-22 8 Q-24 -27 0 -30 Q24 -27 22 8 Q17 14 12 9 Q6 15 0 10 Q-6 15 -12 9 Q-17 14 -22 8 Z"
            fill={hairColor}
            stroke={hairDark}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M2 -7 q8 -1 8 -9 q0 -8 -8 -8 q-7 0 -7 7"
            fill="none"
            stroke={shade(skin, -0.52)}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M-9 1 q-3 5 -1 9 M9 1 q3 5 1 9"
            fill="none"
            stroke={hairDark}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.55"
          />
          {/* 不快度が高いと汗のしずく */}
          {worried && (
            <path
              d="M27 -2 q3 5 0 8 q-3 -3 0 -8 Z"
              fill="#7ec8f0"
              stroke="#4aa3d4"
              strokeWidth="0.8"
            />
          )}
        </g>
      </g>
    </svg>
  );
}
