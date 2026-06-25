import type { GameConfig } from '../types/game';

// 体力の次フレーム値。SPEC準拠で「経過時間(秒)」に比例して消費する。
// 不快度がしきい値以上のとき消費が drainMultiplier 倍になる（更新前の不快度で判定）。
export const nextStamina = (
  stamina: number,
  discomfort: number,
  dt: number,
  config: GameConfig,
): number => {
  const mult =
    discomfort >= config.discomfortThreshold ? config.drainMultiplier : 1;
  return stamina - config.drainPerSec * dt * mult;
};

// 不快度の次フレーム値。体力消費の2倍の速さで上昇し、100で頭打ち。
export const nextDiscomfort = (
  discomfort: number,
  dt: number,
  config: GameConfig,
): number => Math.min(100, discomfort + config.drainPerSec * 2 * dt);
