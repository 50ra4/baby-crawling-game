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
      <div className="hud-top">
        <div className="gauges">
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
        <div className="scores">
          <div className="sc-now">
            {distance}
            <span>m</span>
          </div>
          <div className="sc-best">BEST {bestDistance}m</div>
        </div>
      </div>
      <div className="hud-name">{displayName}</div>
    </div>
  );
}
