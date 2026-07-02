import { checkCollisions } from './collision';
import { createGameState } from './createGameState';
import { BABY_Y, DEFAULT_CONFIG } from '../constants/gameConfig';
import type { GameObject, GameState } from '../types/game';

// 赤ちゃんの位置(babyX, BABY_Y)に重なるオブジェクトを置いた状態を作る
const stateWith = (
  object: Partial<GameObject>,
  overrides: Partial<GameState> = {},
): GameState => {
  const base = createGameState(DEFAULT_CONFIG);
  return {
    ...base,
    elapsed: 1,
    objects: [
      {
        id: 1,
        kind: 'teddy',
        x: base.babyX,
        y: BABY_Y,
        hit: false,
        scale: 1,
        vx: 0,
        ...object,
      },
    ],
    ...overrides,
  };
};

describe('checkCollisions', () => {
  it('哺乳瓶に触れると体力が回復しヒット済みになる', () => {
    const state = stateWith({ kind: 'bottle' }, { stamina: 50 });
    const { state: next, events } = checkCollisions(state, DEFAULT_CONFIG);
    expect(next.stamina).toBe(50 + 100 * (DEFAULT_CONFIG.bottleHealPct / 100));
    expect(next.objects.at(0)?.hit).toBe(true);
    expect(events).toContainEqual({ type: 'sfx', name: 'bottle' });
  });

  it('哺乳瓶の回復は最大体力を超えない', () => {
    const state = stateWith({ kind: 'bottle' }, { stamina: 95 });
    const { state: next } = checkCollisions(state, DEFAULT_CONFIG);
    expect(next.stamina).toBe(100);
  });

  it('オムツに触れると不快度が0にリセットされる', () => {
    const state = stateWith({ kind: 'diaper' }, { discomfort: 80 });
    const { state: next, events } = checkCollisions(state, DEFAULT_CONFIG);
    expect(next.discomfort).toBe(0);
    expect(events).toContainEqual({ type: 'sfx', name: 'diaper' });
  });

  it('おもちゃに当たると体力が減り遊ぶ接触になる', () => {
    const state = stateWith({ kind: 'ball' }, { stamina: 100 });
    const { state: next, events } = checkCollisions(state, DEFAULT_CONFIG);
    expect(next.stamina).toBe(100 - DEFAULT_CONFIG.toyDamage);
    expect(next.contact?.type).toBe('play');
    expect(events).toContainEqual({ type: 'sfx', name: 'toy' });
  });

  it('無敵時間中はおもちゃの衝突を無視する', () => {
    const state = stateWith(
      { kind: 'ball' },
      { stamina: 100, elapsed: 0.5, invincibleUntil: 1.0 },
    );
    const { state: next, events } = checkCollisions(state, DEFAULT_CONFIG);
    expect(next.stamina).toBe(100);
    expect(next.objects.at(0)?.hit).toBe(false);
    expect(events).toHaveLength(0);
  });

  it('無敵時間中でも回復アイテムは取得できる', () => {
    const state = stateWith(
      { kind: 'bottle' },
      { stamina: 50, elapsed: 0.5, invincibleUntil: 1.0 },
    );
    const { state: next } = checkCollisions(state, DEFAULT_CONFIG);
    expect(next.stamina).toBeGreaterThan(50);
  });

  it('離れたオブジェクトとは衝突しない', () => {
    const state = stateWith({ kind: 'teddy', x: 0, y: 0 }, { stamina: 100 });
    const { state: next, events } = checkCollisions(state, DEFAULT_CONFIG);
    expect(next.stamina).toBe(100);
    expect(events).toHaveLength(0);
  });

  it('すでにヒット済みのオブジェクトは再処理しない', () => {
    const state = stateWith({ kind: 'teddy', hit: true }, { stamina: 100 });
    const { state: next } = checkCollisions(state, DEFAULT_CONFIG);
    expect(next.stamina).toBe(100);
  });

  it('遊んだ後は同フレームの2体目のおもちゃを無敵で無視する', () => {
    const base = createGameState(DEFAULT_CONFIG);
    const state: GameState = {
      ...base,
      elapsed: 1,
      stamina: 100,
      objects: [
        {
          id: 1,
          kind: 'teddy',
          x: base.babyX,
          y: BABY_Y,
          hit: false,
          scale: 1,
          vx: 0,
        },
        {
          id: 2,
          kind: 'teddy',
          x: base.babyX,
          y: BABY_Y,
          hit: false,
          scale: 1,
          vx: 0,
        },
      ],
    };
    const { state: next } = checkCollisions(state, DEFAULT_CONFIG);
    expect(next.stamina).toBe(100 - DEFAULT_CONFIG.toyDamage);
    expect(next.objects.at(1)?.hit).toBe(false);
  });
});
