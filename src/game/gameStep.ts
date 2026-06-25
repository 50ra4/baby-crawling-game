import type {
  GameConfig,
  GameEvent,
  GameState,
  InputState,
  StepResult,
} from '../types/game';
import { PX_PER_M } from '../constants/gameConfig';
import { updateContact } from './contact';
import { moveBaby, moveObjects } from './movement';
import { nextDiscomfort, nextStamina } from './stamina';
import { spawnObject } from './spawnObject';
import { checkCollisions } from './collision';
import { nextShake } from './shake';
import { updatePopups } from './popups';

// ハイハイ位相の基準スクロール速度（位相はスクロール速度に比例する）
const PHASE_BASE_SPEED = 200;

// 1フレーム分のゲーム更新。新しい状態と副作用イベントを返す純粋関数。
export const stepGame = (
  state: GameState,
  dt: number,
  config: GameConfig,
  input: InputState,
): StepResult => {
  const events: GameEvent[] = [];

  const elapsed = state.elapsed + dt;
  const phase =
    (state.phase +
      config.crawlCyclesPerSec * (config.scrollSpeed / PHASE_BASE_SPEED) * dt) %
    1;

  // 接触フリーズはフレーム開始時点で接触があれば有効。接触自体は進行・解除する。
  const frozen = state.contact !== null;
  const contact = updateContact(state.contact, dt);

  // 横移動はフリーズ中でも継続する
  const babyX = moveBaby(state.babyX, dt, config, input);

  let working: GameState = {
    ...state,
    elapsed,
    phase,
    contact,
    babyX,
  };

  // 接触フリーズ中は「スコア・距離の加算」を停止する（SPEC準拠）。
  // スクロール・スポーン・時間ベースの体力消費はこのブロックに限定する。
  if (!frozen) {
    const distancePx = working.distancePx + config.scrollSpeed * dt;
    const score = Math.floor(distancePx / PX_PER_M);
    const stamina = nextStamina(
      working.stamina,
      working.discomfort,
      dt,
      config,
    );

    let objects = moveObjects(working.objects, dt, config);

    let spawnAcc = working.spawnAcc + dt;
    let nextId = working.nextId;
    if (spawnAcc >= config.spawnInterval) {
      spawnAcc -= config.spawnInterval;
      objects = [...objects, spawnObject(nextId, config)];
      nextId += 1;
    }

    working = {
      ...working,
      distancePx,
      score,
      stamina,
      objects,
      spawnAcc,
      nextId,
    };
  }

  // 不快度の上昇とアイテム取得・被弾判定はフリーズ中でも行い、即時に反映する。
  // （哺乳瓶・オムツを取った瞬間にゲージへ反映させる）
  working = {
    ...working,
    discomfort: nextDiscomfort(working.discomfort, dt, config),
  };

  const collision = checkCollisions(working, config);
  working = collision.state;
  events.push(...collision.events);

  const shake = nextShake(working.shake, dt, config.shakeDuration);
  const popups = updatePopups(working.popups, dt);
  working = { ...working, shake, popups };

  if (working.stamina <= 0 && !working.over) {
    const dist = Math.floor(working.distancePx / PX_PER_M);
    working = { ...working, stamina: 0, over: true };
    events.push({ type: 'gameover', dist, score: dist });
  }

  return { state: working, events };
};
