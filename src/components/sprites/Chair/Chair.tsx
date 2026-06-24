import { IMG_SPRITE_STYLE } from '../spriteStyle';
import chairImg from '../../../assets/sprites/chair.png';

type ChairProps = {
  size?: number;
};

export function Chair({ size = 52 }: ChairProps) {
  return (
    <img
      src={chairImg}
      alt=""
      width={size}
      height={size}
      style={IMG_SPRITE_STYLE}
    />
  );
}
