import { SPRITE_STYLE } from '../spriteStyle';

type BottleProps = {
  size?: number;
};

// 哺乳瓶（回復アイテム）
export function Bottle({ size = 52 }: BottleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 56" style={SPRITE_STYLE}>
      <ellipse cx="26" cy="52" rx="14" ry="4" fill="rgba(0,0,0,0.1)" />
      <rect
        x="13"
        y="18"
        width="26"
        height="32"
        rx="12"
        fill="#eaf6ff"
        stroke="#9cc6e8"
        strokeWidth="2.2"
      />
      <path d="M16 40 Q16 47 24 48 L28 48 Q36 47 36 40 Z" fill="#bfe0ff" />
      <rect
        x="17"
        y="10"
        width="18"
        height="10"
        rx="5"
        fill="#ffd56b"
        stroke="#e0ab33"
        strokeWidth="1.8"
      />
      <path
        d="M21 10 Q26 1 31 10"
        fill="#ffe39a"
        stroke="#e0ab33"
        strokeWidth="1.8"
      />
      <g stroke="#9cc6e8" strokeWidth="1.5" strokeLinecap="round">
        <line x1="20" y1="26" x2="32" y2="26" />
        <line x1="20" y1="30" x2="32" y2="30" />
        <line x1="20" y1="34" x2="32" y2="34" />
      </g>
      <ellipse cx="20" cy="24" rx="2.5" ry="5" fill="#fff" opacity="0.7" />
    </svg>
  );
}
