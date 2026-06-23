import { SPRITE_STYLE } from '../spriteStyle';

type BallProps = {
  size?: number;
};

// ボール（おもちゃ・動的）
export function Ball({ size = 52 }: BallProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" style={SPRITE_STYLE}>
      <ellipse cx="26" cy="48" rx="15" ry="4" fill="rgba(0,0,0,0.12)" />
      <circle cx="26" cy="27" r="19" fill="#ff8da3" stroke="#e36b85" strokeWidth="2.2" />
      <path d="M7 27 Q26 18 45 27" fill="none" stroke="#fff" strokeWidth="2.6" opacity="0.9" />
      <path d="M26 8 Q34 27 26 46" fill="none" stroke="#fff" strokeWidth="2.6" opacity="0.9" />
      <path d="M11 16 Q20 22 18 35" fill="none" stroke="#ffd1db" strokeWidth="2" opacity="0.8" />
      <ellipse cx="19" cy="19" rx="4.5" ry="3.5" fill="#fff" opacity="0.6" />
    </svg>
  );
}
