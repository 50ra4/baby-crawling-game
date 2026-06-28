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

// 位置をステージ内にクランプし、壁に達していれば速度を消して返す
// （壁ぎわで張り付かず素直に止まる）。
const clampWithinStage = (x: number, vx: number): { x: number; vx: number } => {
  const clamped = clamp(x, MARGIN, STAGE_WIDTH - MARGIN);
  if (clamped === MARGIN || clamped === STAGE_WIDTH - MARGIN) {
    return { x: clamped, vx: 0 };
  }
  return { x: clamped, vx };
};

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
  // 現在速度を目標速度へ寄せられる1フレームあたりの最大変化量（加速度×dt）。
  const maxDv = config.babyAccel * dt;

  // キー入力を最優先。目標速度へ加速度ぶんだけ寄せて急発進を避ける（遊び）。
  if (input.left || input.right) {
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const targetVx = dir * config.babyMoveSpeed;
    const vx = babyVx + clamp(targetVx - babyVx, -maxDv, maxDv);
    return clampWithinStage(babyX + vx * dt, vx);
  }

  // タップ/ドラッグ目標へ追従する（指を離した後も目標が残る限り続く）。
  if (input.targetX !== null) {
    const remaining = input.targetX - babyX;
    // 目標付近で、直前のキー操作などで残った「目標と逆向き(=行き過ぎ方向)」の
    // 速度を打ち消す。これをしないと現在地付近をタップしても、残存速度で
    // 加速度ぶんしか減速できず目標を大きく通り過ぎてしまう。
    const startVx =
      Math.abs(remaining) < EASE_DISTANCE && babyVx * remaining < 0
        ? 0
        : babyVx;
    // 目標付近では目標速度を比例して落として行き過ぎを防ぐ（操作の遊び）。
    const targetVx =
      clamp(remaining / EASE_DISTANCE, -1, 1) * config.babyMoveSpeed;
    const vx = startVx + clamp(targetVx - startVx, -maxDv, maxDv);
    const x = babyX + vx * dt;
    // 1フレームで目標へ到達/通過するなら、行き過ぎずに目標で止める。
    if (
      remaining === 0 ||
      Math.sign(input.targetX - x) !== Math.sign(remaining)
    ) {
      return clampWithinStage(input.targetX, 0);
    }
    return clampWithinStage(x, vx);
  }

  // 入力なし：慣性で減速しながら停止へ向かう（即停止しない遊び）。
  const vx = babyVx + clamp(-babyVx, -maxDv, maxDv);
  return clampWithinStage(babyX + vx * dt, vx);
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
