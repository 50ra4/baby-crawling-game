import { IMG_SPRITE_STYLE } from '../spriteStyle';
import { duckImg } from '../../../assets/sprites/spriteImages';

type DuckProps = {
  size?: number;
};

export function Duck({ size = 52 }: DuckProps) {
  return (
    <img
      src={duckImg}
      alt=""
      draggable={false}
      width={size}
      height={size}
      style={IMG_SPRITE_STYLE}
    />
  );
}
