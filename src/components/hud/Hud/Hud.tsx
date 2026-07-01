import { clamp } from '../../../utils/math';
import { Gauge } from '../Gauge/Gauge';
import { discomfortColor, staminaColor } from '../gaugeColor';

type HudProps = {
  stamina: number;
  maxStamina: number;
  discomfort: number;
  distance: number;
  bestDistance: number;
  displayName: string;
};

// プレイ中の上部HUD（体力・不快度ゲージ＋距離＋ベスト＋名前）
export function Hud({
  stamina,
  maxStamina,
  discomfort,
  distance,
  bestDistance,
  displayName,
}: HudProps) {
  const staminaRatio = clamp(stamina / maxStamina, 0, 1);
  const discomfortRatio = discomfort / 100;
  return (
    <div className="hud">
      <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2.5">
        <div className="flex max-w-[200px] flex-1 flex-col gap-[7px]">
          <Gauge
            icon="体力"
            ratio={staminaRatio}
            color={staminaColor(staminaRatio)}
          />
          <Gauge
            icon="おむつ"
            ratio={discomfortRatio}
            color={discomfortColor(discomfortRatio)}
            warn={discomfort >= 100 ? '！パンパン！' : undefined}
          />
        </div>
        <div className="font-latin text-right">
          <div className="sc-now">
            {distance}
            <span className="ml-0.5 text-[14px]">m</span>
          </div>
          <div className="mt-[3px] text-[12px] font-bold text-white/60">
            BEST {bestDistance}m
          </div>
        </div>
      </div>
      <div className="hud-name">{displayName}</div>
    </div>
  );
}
