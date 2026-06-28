import type { GameConfig, GameObject, InputState } from '../types/game';
import {
  MARGIN,
  OBJECT_META,
  STAGE_HEIGHT,
  STAGE_WIDTH,
} from '../constants/gameConfig';
import { clamp } from '../utils/math';

// 動的オブジェクトが反射する側壁の内側マージン
const WALL = 26;
// 画面外として除去する下端の閾値
const DESPAWN_Y = STAGE_HEIGHT + 80;
// タップ/ドラッグ目標に近づくと減速を始める距離(px)。この範囲で目標速度を
// 比例して落とし、行き過ぎずに止まる（操作の遊び）。
const EASE_DISTANCE = 36;

// 赤ちゃんの横移動を計算し、新しい位置 x と速度 vx を返す。
// 入力から目標速度を決め、現在速度を加速度でなめらかに寄せることで、
// 急発進・急停止を避けて操作に遊びを持たせる。キー入力を最優先し、
// 無ければタップ/ドラッグの目標(input.targetX)へ追従する。
export const moveBaby = (
  babyX: number,
  babyVx: number,
  dt: number,
  config: GameConfig,
  input: InputState,
): { x: number; vx: number } => {
  let targetVx = 0;
  if (input.left || input.right) {
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    targetVx = dir * config.babyMoveSpeed;
  } else if (input.targetX !== null) {
    // 目標付近では目標速度を落として行き過ぎを防ぐ（指を離した後も追従する）。
    const ratio = clamp((input.targetX - babyX) / EASE_DISTANCE, -1, 1);
    targetVx = ratio * config.babyMoveSpeed;
  }

  // 現在速度を目標速度へ加速度ぶんだけ寄せる（加速・減速）。
  const maxDv = config.babyAccel * dt;
  const vx = babyVx + clamp(targetVx - babyVx, -maxDv, maxDv);

  const x = clamp(babyX + vx * dt, MARGIN, STAGE_WIDTH - MARGIN);
  // 壁に達したら速度を消す（壁ぎわで張り付かず素直に止まる）。
  if (x === MARGIN || x === STAGE_WIDTH - MARGIN) {
    return { x, vx: 0 };
  }
  return { x, vx };
};

// 全オブジェクトを移動させ、画面外に出たものを除去する。
export const moveObjects = (
  objects: GameObject[],
  dt: number,
  config: GameConfig,
): GameObject[] =>
  objects
    .map((object) => {
      const dynamic = OBJECT_META[object.kind].dynamic;
      const fallSpeed = dynamic ? config.scrollSpeed * 1.5 : config.scrollSpeed;
      const y = object.y + fallSpeed * dt;

      if (!dynamic) {
        return { ...object, y };
      }

      let x = object.x + object.vx * dt;
      let vx = object.vx;
      if (x < WALL) {
        x = WALL;
        vx = Math.abs(vx);
      } else if (x > STAGE_WIDTH - WALL) {
        x = STAGE_WIDTH - WALL;
        vx = -Math.abs(vx);
      }
      return { ...object, x, y, vx };
    })
    .filter((object) => object.y < DESPAWN_Y);
