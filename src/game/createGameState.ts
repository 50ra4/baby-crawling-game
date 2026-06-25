import type { GameConfig, GameState } from '../types/game';
import { STAGE_WIDTH } from '../constants/gameConfig';

// ゲーム開始時の初期状態を生成する。start/restart のたびに呼ぶ。
export const createGameState = (config: GameConfig): GameState => ({
  babyX: STAGE_WIDTH / 2,
  stamina: config.staminaStart,
  maxStamina: config.staminaStart,
  discomfort: 0,
  distancePx: 0,
  score: 0,
  objects: [],
  nextId: 1,
  spawnAcc: 0,
  phase: 0,
  contact: null,
  invincibleUntil: -1,
  invincibleType: null,
  shake: 0,
  popups: [],
  popId: 1,
  elapsed: 0,
  over: false,
});
