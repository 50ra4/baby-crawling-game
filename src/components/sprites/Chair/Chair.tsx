import { SPRITE_STYLE } from '../spriteStyle';

type ChairProps = {
  size?: number;
};

// 子ども用の木の椅子（障害物・静的）
export function Chair({ size = 52 }: ChairProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 58" style={SPRITE_STYLE}>
      <ellipse cx="26" cy="53" rx="18" ry="4" fill="rgba(0,0,0,0.12)" />
      <line x1="20" y1="31" x2="17" y2="50" stroke="#b5783f" strokeWidth="3.6" strokeLinecap="round" />
      <line x1="34" y1="31" x2="37" y2="50" stroke="#b5783f" strokeWidth="3.6" strokeLinecap="round" />
      <rect x="14" y="7" width="24" height="21" rx="5" fill="#f0b56e" stroke="#b5783f" strokeWidth="2" />
      <rect x="19" y="12" width="14" height="12" rx="3" fill="#e2a45c" />
      <ellipse cx="22" cy="12" rx="3" ry="2" fill="#fff" opacity="0.4" />
      <rect x="12" y="26" width="28" height="9" rx="3.5" fill="#e2a45c" stroke="#b5783f" strokeWidth="2" />
      <line x1="16" y1="34" x2="15" y2="51" stroke="#cf9152" strokeWidth="4" strokeLinecap="round" />
      <line x1="36" y1="34" x2="37" y2="51" stroke="#cf9152" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
