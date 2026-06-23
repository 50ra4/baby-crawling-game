import { SPRITE_STYLE } from '../spriteStyle';

type DiaperProps = {
  size?: number;
};

// オムツ（不快度リセットアイテム）
export function Diaper({ size = 52 }: DiaperProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" style={SPRITE_STYLE}>
      <ellipse cx="26" cy="46" rx="16" ry="4" fill="rgba(0,0,0,0.1)" />
      <path d="M9 17 Q26 11 43 17 Q43 36 26 43 Q9 36 9 17 Z" fill="#fffdf8" stroke="#cfdce8" strokeWidth="2.2" />
      <path d="M9 17 Q26 26 43 17 L43 23 Q26 32 9 23 Z" fill="#cfe9ff" />
      <rect x="6" y="14" width="7" height="11" rx="3.5" fill="#eaf2f8" stroke="#cfdce8" strokeWidth="1.6" />
      <rect x="39" y="14" width="7" height="11" rx="3.5" fill="#eaf2f8" stroke="#cfdce8" strokeWidth="1.6" />
      <circle cx="18" cy="31" r="2.3" fill="#ffc2d6" />
      <circle cx="26" cy="34" r="2.3" fill="#bfe6c9" />
      <circle cx="34" cy="31" r="2.3" fill="#ffe39a" />
    </svg>
  );
}
