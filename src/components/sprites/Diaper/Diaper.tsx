import { IMG_SPRITE_STYLE } from '../spriteStyle';
import { SPRITE_SOURCES } from '../../../assets/sprites/spriteSources';

type DiaperProps = {
  size?: number;
};

export function Diaper({ size = 52 }: DiaperProps) {
  return (
    <img
      src={SPRITE_SOURCES.diaper}
      alt=""
      draggable={false}
      width={size}
      height={size}
      style={IMG_SPRITE_STYLE}
    />
  );
}
