import { SPRITE_STYLE } from '../spriteStyle';

type TeddyProps = {
  size?: number;
};

const FUR = '#c79a6b';
const FUR_DARK = '#a87f52';
const FUR_LIGHT = '#ecd6b8';

// テディベア（おもちゃ・静的）
export function Teddy({ size = 56 }: TeddyProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 62" style={SPRITE_STYLE}>
      <ellipse cx="30" cy="57" rx="21" ry="4" fill="rgba(0,0,0,0.12)" />
      <ellipse
        cx="20"
        cy="49"
        rx="10"
        ry="9"
        fill={FUR}
        stroke={FUR_DARK}
        strokeWidth="2"
      />
      <ellipse
        cx="40"
        cy="49"
        rx="10"
        ry="9"
        fill={FUR}
        stroke={FUR_DARK}
        strokeWidth="2"
      />
      <ellipse cx="20" cy="50" rx="4.5" ry="4" fill={FUR_LIGHT} />
      <ellipse cx="40" cy="50" rx="4.5" ry="4" fill={FUR_LIGHT} />
      <ellipse
        cx="11"
        cy="35"
        rx="7.5"
        ry="9"
        fill={FUR}
        stroke={FUR_DARK}
        strokeWidth="2"
        transform="rotate(-18 11 35)"
      />
      <ellipse
        cx="49"
        cy="35"
        rx="7.5"
        ry="9"
        fill={FUR}
        stroke={FUR_DARK}
        strokeWidth="2"
        transform="rotate(18 49 35)"
      />
      <ellipse
        cx="30"
        cy="39"
        rx="15"
        ry="14"
        fill={FUR}
        stroke={FUR_DARK}
        strokeWidth="2.2"
      />
      <ellipse cx="30" cy="41" rx="9" ry="9" fill={FUR_LIGHT} />
      <circle
        cx="18"
        cy="11"
        r="7"
        fill={FUR}
        stroke={FUR_DARK}
        strokeWidth="2"
      />
      <circle
        cx="42"
        cy="11"
        r="7"
        fill={FUR}
        stroke={FUR_DARK}
        strokeWidth="2"
      />
      <circle cx="18" cy="11" r="3.2" fill={FUR_LIGHT} />
      <circle cx="42" cy="11" r="3.2" fill={FUR_LIGHT} />
      <circle
        cx="30"
        cy="18"
        r="13"
        fill={FUR}
        stroke={FUR_DARK}
        strokeWidth="2.2"
      />
      <ellipse cx="30" cy="22" rx="7" ry="5.5" fill={FUR_LIGHT} />
      <ellipse cx="30" cy="19.5" rx="2.6" ry="2" fill="#5a4232" />
      <path
        d="M30 21.5 v3"
        stroke="#5a4232"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M30 24.5 q-3 2 -5 0 M30 24.5 q3 2 5 0"
        fill="none"
        stroke="#5a4232"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="24.5" cy="15" r="2.1" fill="#4a3526" />
      <circle cx="35.5" cy="15" r="2.1" fill="#4a3526" />
      <circle cx="25.2" cy="14.3" r="0.7" fill="#fff" />
      <circle cx="36.2" cy="14.3" r="0.7" fill="#fff" />
    </svg>
  );
}
