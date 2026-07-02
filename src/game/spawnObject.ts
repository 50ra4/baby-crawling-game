import type { GameConfig, GameObject, ObjectKind } from '../types/game';
import { KINDS, LANES, OBJECT_META, laneX } from '../constants/gameConfig';

// おもちゃの具体的なkindを等確率で抽選する
export const pickToyKind = (): ObjectKind => {
  const list = KINDS.toy;
  return list.at(Math.floor(Math.random() * list.length))!;
};

// 指定したkindのオブジェクトを1体生成する。idは呼び出し側が採番して渡す。
// kindは決定論的に受け取り、レーンと動的初速のみ乱数で決める。
export const spawnObject = (
  id: number,
  kind: ObjectKind,
  config: GameConfig,
): GameObject => {
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
