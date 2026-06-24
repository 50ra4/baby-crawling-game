import { IMG_SPRITE_STYLE } from '../spriteStyle';
import ballImg from '../../../assets/sprites/ball.png';

type BallProps = {
  size?: number;
};

export function Ball({ size = 52 }: BallProps) {
  return (
    <img
      src={ballImg}
      alt=""
      width={size}
      height={size}
      style={IMG_SPRITE_STYLE}
    />
  );
}
