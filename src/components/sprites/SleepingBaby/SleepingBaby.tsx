import { shade } from '../../../utils/color';
import { SPRITE_STYLE } from '../spriteStyle';

type SleepingBabyProps = {
  skin?: string;
  cloth?: string;
  size?: number;
  t?: number;
};

// ゲームオーバーで布団に横たわって眠る赤ちゃん
export function SleepingBaby({
  skin = '#ffd9bf',
  cloth = '#ffb3c7',
  size = 230,
  t = 0,
}: SleepingBabyProps) {
  const breathe = Math.sin(t * 1.6) * 0.9;
  const skinShade = shade(skin, -0.12);
  const clothShade = shade(cloth, -0.12);
  const hair = shade(skin, -0.42);
  const hairDark = shade(skin, -0.52);
  const cheek = shade(skin, -0.04);

  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 240 172"
      style={SPRITE_STYLE}
    >
      <defs>
        <radialGradient id="sleepCheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9bb0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff9bb0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="122" cy="152" rx="106" ry="16" fill="rgba(0,0,0,0.08)" />

      {/* 布団 */}
      <rect
        x="16"
        y="80"
        width="208"
        height="70"
        rx="26"
        fill="#fdfaf3"
        stroke="#ece1cd"
        strokeWidth="2.5"
      />
      <path
        d="M70 86 L70 144 M124 86 L124 144 M178 86 L178 144"
        stroke="#efe6d4"
        strokeWidth="2"
        opacity="0.85"
      />
      <ellipse
        cx="78"
        cy="104"
        rx="48"
        ry="31"
        fill="#ffffff"
        stroke="#ece1cd"
        strokeWidth="2.5"
      />
      <ellipse cx="78" cy="105" rx="35" ry="20" fill="#fbf4e6" opacity="0.7" />

      {/* 横向きに眠る赤ちゃん（ゆっくり呼吸） */}
      <g transform={`translate(0 ${breathe})`}>
        <path
          d="M150 118 q36 -4 42 16 q-2 13 -22 9 q5 -15 -20 -11 Z"
          fill={cloth}
          stroke={clothShade}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M118 122 q-12 14 4 24"
          fill="none"
          stroke={skin}
          strokeWidth="13"
          strokeLinecap="round"
        />

        <path
          d="M104 94 Q150 82 166 110 Q176 134 150 144 Q116 152 96 132 Q84 110 104 94 Z"
          fill={cloth}
          stroke={clothShade}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M118 102 Q146 98 158 120"
          fill="none"
          stroke={clothShade}
          strokeWidth="1.6"
          opacity="0.5"
        />

        <g transform="translate(78 100) rotate(-13)">
          <path
            d="M-30 -6 Q-32 -34 0 -36 Q32 -34 30 -4 Q30 14 14 22 Q-4 30 -22 22 Q-37 13 -30 -6 Z"
            fill={skin}
            stroke={skinShade}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M-24 12 Q-16 30 8 25 Q0 21 -4 12 Z"
            fill={cheek}
            opacity="0.55"
          />
          <circle
            cx="27"
            cy="5"
            r="6"
            fill={skin}
            stroke={skinShade}
            strokeWidth="1.4"
          />
          <path
            d="M-28 -8 Q-30 -34 0 -36 Q30 -34 28 -6 Q15 -1 0 -3 Q-14 -1 -28 -8 Z"
            fill={hair}
            stroke={hairDark}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M4 -16 q9 -1 9 -9"
            fill="none"
            stroke={hairDark}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M-17 3 Q-11 -3 -5 3"
            fill="none"
            stroke="#4a3526"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M3 5 Q9 -1 15 5"
            fill="none"
            stroke="#4a3526"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <ellipse cx="-9" cy="15" rx="12" ry="9" fill="url(#sleepCheek)" />
          <ellipse cx="15" cy="13" rx="6" ry="5" fill="url(#sleepCheek)" />
          <path
            d="M-5 17 Q0 21 6 17"
            fill="none"
            stroke="#c4607a"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        <path
          d="M58 116 q-8 -16 6 -26"
          fill="none"
          stroke={skin}
          strokeWidth="13"
          strokeLinecap="round"
        />
        <circle
          cx="64"
          cy="90"
          r="9"
          fill={skin}
          stroke={skinShade}
          strokeWidth="1.4"
        />
        <circle
          cx="60"
          cy="116"
          r="9"
          fill={skin}
          stroke={skinShade}
          strokeWidth="1.4"
        />

        <path
          d="M110 130 Q150 118 198 132 Q204 156 150 162 Q102 160 98 140 Q100 132 110 130 Z"
          fill={shade(cloth, 0.14)}
          stroke={clothShade}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M108 137 Q150 127 194 139"
          fill="none"
          stroke={clothShade}
          strokeWidth="1.6"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}
