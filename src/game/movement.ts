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

type BabyPosition = { babyX: number; targetX: number };

// 赤ちゃんの横移動を計算する。キー入力優先、なければドラッグ追従。
export const moveBaby = (
  babyX: number,
  targetX: number,
  dt: number,
  config: GameConfig,
  input: InputState,
): BabyPosition => {
  if (input.left || input.right) {
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const moved = clamp(
      babyX + dir * config.babyMoveSpeed * dt,
      MARGIN,
      STAGE_WIDTH - MARGIN,
    );
    return { babyX: moved, targetX: moved };
  }

  if (input.dragging) {
    const maxStep = config.babyMoveSpeed * dt;
    const delta = clamp(targetX - babyX, -maxStep, maxStep);
    return { babyX: babyX + delta, targetX };
  }

  return { babyX, targetX };
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
