import type { GameConfig } from '../types/game';
import { PX_PER_M } from '../constants/gameConfig';

// 体力の次フレーム値。SPEC準拠で「進んだ距離(m)」に比例して消費する。
// 不快度がしきい値以上のとき消費が drainMultiplier 倍になる（更新前の不快度で判定）。
export const nextStamina = (
  stamina: number,
  discomfort: number,
  distancePx: number,
  config: GameConfig,
): number => {
  const mult =
    discomfort >= config.discomfortThreshold ? config.drainMultiplier : 1;
  return stamina - config.staminaPerMeter * (distancePx / PX_PER_M) * mult;
};

// 不快度の次フレーム値。discomfortFillSec 秒で0→100へ上昇し、100で頭打ち。
export const nextDiscomfort = (
  discomfort: number,
  dt: number,
  config: GameConfig,
): number => Math.min(100, discomfort + (100 / config.discomfortFillSec) * dt);
