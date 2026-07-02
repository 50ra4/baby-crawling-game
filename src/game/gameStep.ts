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
import { pickToyKind, spawnObject } from './spawnObject';
import { checkCollisions } from './collision';
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
  const { x: babyX, vx: babyVx } = moveBaby(
    state.babyX,
    state.babyVx,
    dt,
    config,
    input,
  );

  let working: GameState = {
    ...state,
    elapsed,
    phase,
    contact,
    babyX,
    babyVx,
  };

  // 接触フリーズ中は「スコア・距離の加算」とスクロール・スポーンを停止する（SPEC準拠）。
  if (!frozen) {
    const distancePx = working.distancePx + config.scrollSpeed * dt;
    const score = Math.floor(distancePx / PX_PER_M);

    let objects = moveObjects(working.objects, dt, config);
    let nextId = working.nextId;

    // おもちゃ・哺乳瓶・オムツはそれぞれ独立した固定間隔で出現させる。
    // 哺乳瓶/オムツは種類を固定し確実に供給、おもちゃのみ種類を抽選する。
    let toySpawnAcc = working.toySpawnAcc + dt;
    if (toySpawnAcc >= config.toyInterval) {
      toySpawnAcc -= config.toyInterval;
      objects = [...objects, spawnObject(nextId, pickToyKind(), config)];
      nextId += 1;
    }

    let bottleAcc = working.bottleAcc + dt;
    if (bottleAcc >= config.bottleInterval) {
      bottleAcc -= config.bottleInterval;
      objects = [...objects, spawnObject(nextId, 'bottle', config)];
      nextId += 1;
    }

    let diaperAcc = working.diaperAcc + dt;
    if (diaperAcc >= config.diaperInterval) {
      diaperAcc -= config.diaperInterval;
      objects = [...objects, spawnObject(nextId, 'diaper', config)];
      nextId += 1;
    }

    working = {
      ...working,
      distancePx,
      score,
      objects,
      toySpawnAcc,
      bottleAcc,
      diaperAcc,
      nextId,
    };
  }

  // 体力消費・不快度上昇は時間ベースのため、フリーズ中でも継続して両ゲージへ反映する。
  // アイテム取得・被弾判定もフリーズ中に行い、即時にゲージへ反映させる。
  // （体力の消費倍率は更新前の不快度で判定するため、discomfort より先に評価する）
  working = {
    ...working,
    stamina: nextStamina(working.stamina, working.discomfort, dt, config),
    discomfort: nextDiscomfort(working.discomfort, dt, config),
  };

  const collision = checkCollisions(working, config);
  working = collision.state;
  events.push(...collision.events);

  const popups = updatePopups(working.popups, dt);
  working = { ...working, popups };

  if (working.stamina <= 0 && !working.over) {
    const dist = Math.floor(working.distancePx / PX_PER_M);
    working = { ...working, stamina: 0, over: true };
    events.push({ type: 'gameover', dist, score: dist });
  }

  return { state: working, events };
};
