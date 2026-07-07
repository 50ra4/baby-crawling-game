import { IMG_SPRITE_STYLE } from '../spriteStyle';
import { SPRITE_SOURCES } from '../../../assets/sprites/spriteSources';

type DuckProps = {
  size?: number;
};

export function Duck({ size = 52 }: DuckProps) {
  return (
    <img
      src={SPRITE_SOURCES.duck}
      alt=""
      draggable={false}
      width={size}
      height={size}
      style={IMG_SPRITE_STYLE}
    />
  );
}
