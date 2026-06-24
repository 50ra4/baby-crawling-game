import { IMG_SPRITE_STYLE } from '../spriteStyle';
import babySleepImg from '../../../assets/sprites/baby-sleep.png';

type SleepingBabyProps = {
  skin?: string;
  cloth?: string;
  size?: number;
  t?: number;
};

export function SleepingBaby({
  size = 230,
  t = 0,
}: SleepingBabyProps) {
  const breathe = Math.sin(t * 1.6) * 0.9;

  return (
    <img
      src={babySleepImg}
      alt=""
      draggable={false}
      width={size}
      height={size * 0.72}
      style={{
        ...IMG_SPRITE_STYLE,
        transform: `translateY(${breathe}px)`,
      }}
    />
  );
}
