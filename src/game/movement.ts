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

// 赤ちゃんの横移動を計算し、新しい babyX を返す。
// キー入力を最優先し、無ければタップ/ドラッグの目標(input.targetX)へ追従する。
export const moveBaby = (
  babyX: number,
  dt: number,
  config: GameConfig,
  input: InputState,
): number => {
  if (input.left || input.right) {
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    return clamp(
      babyX + dir * config.babyMoveSpeed * dt,
      MARGIN,
      STAGE_WIDTH - MARGIN,
    );
  }

  // タップ/ドラッグで設定された目標へ、1フレーム最大 babyMoveSpeed×dt で追従する。
  // 指を離した後も目標が残る限り移動を続ける（タップ移動）。
  if (input.targetX !== null) {
    const maxStep = config.babyMoveSpeed * dt;
    const delta = clamp(input.targetX - babyX, -maxStep, maxStep);
    return babyX + delta;
  }

  return babyX;
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
