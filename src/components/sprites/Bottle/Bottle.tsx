import { IMG_SPRITE_STYLE } from '../spriteStyle';
import { SPRITE_SOURCES } from '../../../assets/sprites/spriteSources';

type BottleProps = {
  size?: number;
};

export function Bottle({ size = 52 }: BottleProps) {
  return (
    <img
      src={SPRITE_SOURCES.bottle}
      alt=""
      draggable={false}
      width={size}
      height={size}
      style={IMG_SPRITE_STYLE}
    />
  );
}
