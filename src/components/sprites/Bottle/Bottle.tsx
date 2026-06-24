import { IMG_SPRITE_STYLE } from '../spriteStyle';
import bottleImg from '../../../assets/sprites/bottle.png';

type BottleProps = {
  size?: number;
};

export function Bottle({ size = 52 }: BottleProps) {
  return (
    <img
      src={bottleImg}
      alt=""
      draggable={false}
      width={size}
      height={size}
      style={IMG_SPRITE_STYLE}
    />
  );
}
