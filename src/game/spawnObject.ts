import type { GameConfig, GameObject, ObjectCategory } from '../types/game';
import { KINDS, LANES, OBJECT_META, laneX } from '../constants/gameConfig';

// 出現比率の重みでカテゴリを抽選する
const pickCategory = (config: GameConfig): ObjectCategory => {
  const total = config.obstacleRate + config.toyRate + config.itemRate;
  const roll = Math.random() * total;
  if (roll < config.obstacleRate) {
    return 'obstacle';
  }
  if (roll < config.obstacleRate + config.toyRate) {
    return 'toy';
  }
  return 'item';
};

// カテゴリから具体的なkindを抽選する
const pickKind = (category: ObjectCategory, config: GameConfig) => {
  if (category === 'item') {
    return Math.random() * 100 < config.bottleShare ? 'bottle' : 'diaper';
  }
  const list = KINDS[category];
  return list.at(Math.floor(Math.random() * list.length))!;
};

// 1体のオブジェクトを生成する。idは呼び出し側が採番して渡す。
export const spawnObject = (id: number, config: GameConfig): GameObject => {
  const category = pickCategory(config);
  const kind = pickKind(category, config);
  const lane = Math.floor(Math.random() * LANES);

  // 動的オブジェクトのみ斜め方向（±scrollSpeed×0.28〜0.58）の初速を持つ
  let vx = 0;
  if (OBJECT_META[kind].dynamic) {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const speedFactor = 0.28 + Math.random() * 0.3;
    vx = direction * config.scrollSpeed * speedFactor;
  }

  return {
    id,
    kind,
    x: laneX(lane),
    y: -44,
    hit: false,
    scale: 1,
    vx,
  };
};
