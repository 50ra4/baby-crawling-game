import { SPRITE_STYLE } from '../spriteStyle';

type DuckProps = {
  size?: number;
};

// アヒルのおもちゃ（おもちゃ・静的・小）
export function Duck({ size = 52 }: DuckProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 50" style={SPRITE_STYLE}>
      <ellipse cx="28" cy="46" rx="18" ry="3.5" fill="rgba(0,0,0,0.12)" />
      <path
        d="M8 36 Q6 21 23 21 Q41 21 45 34 Q47 41 38 42 L15 42 Q8 42 8 36 Z"
        fill="#ffd23f"
        stroke="#e7a81f"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M9 30 q-8 -4 -8 4 q5 4 10 0 Z"
        fill="#ffd23f"
        stroke="#e7a81f"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle
        cx="37"
        cy="15"
        r="11"
        fill="#ffdc54"
        stroke="#e7a81f"
        strokeWidth="2.2"
      />
      <path
        d="M37 4 q3 -3 5 1 q-2 2 -5 1 Z"
        fill="#ffc52e"
        stroke="#e7a81f"
        strokeWidth="1.2"
      />
      <path
        d="M46 14 q11 -1 10 4 q-2 4 -10 2 Z"
        fill="#ff8a1e"
        stroke="#e06f12"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M47 18 q4 1 8 0"
        stroke="#e06f12"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="36" cy="12" r="2.4" fill="#3a2a1c" />
      <circle cx="36.9" cy="11.2" r="0.8" fill="#fff" />
      <path
        d="M20 31 q9 -6 17 -1 q-7 7 -17 4 Z"
        fill="#ffcb2e"
        stroke="#e7a81f"
        strokeWidth="1.6"
      />
      <path
        d="M5 42 q6 4 14 0 q8 4 16 0 q8 4 14 0"
        fill="none"
        stroke="#bfe6ff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}
