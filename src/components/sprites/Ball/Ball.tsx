import { IMG_SPRITE_STYLE } from '../spriteStyle';
import { SPRITE_SOURCES } from '../../../assets/sprites/spriteSources';

type BallProps = {
  size?: number;
};

export function Ball({ size = 52 }: BallProps) {
  return (
    <img
      src={SPRITE_SOURCES.ball}
      alt=""
      draggable={false}
      width={size}
      height={size}
      style={IMG_SPRITE_STYLE}
    />
  );
}
