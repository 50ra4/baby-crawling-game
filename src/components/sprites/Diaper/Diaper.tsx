import { IMG_SPRITE_STYLE } from '../spriteStyle';
import diaperImg from '../../../assets/sprites/diaper.png';

type DiaperProps = {
  size?: number;
};

export function Diaper({ size = 52 }: DiaperProps) {
  return (
    <img
      src={diaperImg}
      alt=""
      draggable={false}
      width={size}
      height={size}
      style={IMG_SPRITE_STYLE}
    />
  );
}
