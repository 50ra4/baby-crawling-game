import { IMG_SPRITE_STYLE } from '../spriteStyle';
import { teddyImg } from '../../../assets/sprites/spriteImages';

type TeddyProps = {
  size?: number;
};

export function Teddy({ size = 56 }: TeddyProps) {
  return (
    <img
      src={teddyImg}
      alt=""
      draggable={false}
      width={size}
      height={size}
      style={IMG_SPRITE_STYLE}
    />
  );
}
