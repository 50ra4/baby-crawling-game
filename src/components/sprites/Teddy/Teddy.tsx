import { IMG_SPRITE_STYLE } from '../spriteStyle';
import { SPRITE_SOURCES } from '../../../assets/sprites/spriteSources';

type TeddyProps = {
  size?: number;
};

export function Teddy({ size = 56 }: TeddyProps) {
  return (
    <img
      src={SPRITE_SOURCES.teddy}
      alt=""
      draggable={false}
      width={size}
      height={size}
      style={IMG_SPRITE_STYLE}
    />
  );
}
