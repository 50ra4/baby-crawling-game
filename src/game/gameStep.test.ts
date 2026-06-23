import { afterEach, vi } from 'vitest';
import { stepGame } from './gameStep';
import { createGameState } from './createGameState';
import { DEFAULT_CONFIG, PX_PER_M } from '../constants/gameConfig';
import type { InputState } from '../types/game';

const noInput: InputState = {
  left: false,
  right: false,
  dragging: false,
  targetX: 180,
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('stepGame（通常時）', () => {
  it('経過時間が dt 分進む', () => {
    const { state } = stepGame(createGameState(DEFAULT_CONFIG), 0.1, DEFAULT_CONFIG, noInput);
    expect(state.elapsed).toBeCloseTo(0.1);
  });

  it('距離が scrollSpeed×dt 分だけ増える', () => {
    const { state } = stepGame(createGameState(DEFAULT_CONFIG), 0.1, DEFAULT_CONFIG, noInput);
    expect(state.distancePx).toBeCloseTo(DEFAULT_CONFIG.scrollSpeed * 0.1);
  });

  it('スコアは距離をPX_PER_Mで割った整数になる', () => {
    const base = { ...createGameState(DEFAULT_CONFIG), distancePx: PX_PER_M * 5 - 1 };
    const { state } = stepGame(base, 0.1, DEFAULT_CONFIG, noInput);
    // 距離が 190-1+20 = 209px → floor(209/38) = 5
    expect(state.score).toBe(Math.floor(state.distancePx / PX_PER_M));
    expect(state.score).toBe(5);
  });

  it('体力が時間経過で減少する', () => {
    const { state } = stepGame(createGameState(DEFAULT_CONFIG), 0.1, DEFAULT_CONFIG, noInput);
    expect(state.stamina).toBeCloseTo(100 - DEFAULT_CONFIG.drainPerSec * 0.1);
  });

  it('不快度が上昇する', () => {
    const { state } = stepGame(createGameState(DEFAULT_CONFIG), 0.1, DEFAULT_CONFIG, noInput);
    expect(state.discomfort).toBeCloseTo(DEFAULT_CONFIG.drainPerSec * 2 * 0.1);
  });

  it('ハイハイの位相が進む', () => {
    const { state } = stepGame(createGameState(DEFAULT_CONFIG), 0.1, DEFAULT_CONFIG, noInput);
    expect(state.phase).toBeCloseTo(DEFAULT_CONFIG.crawlCyclesPerSec * 1 * 0.1);
  });

  it('右キー入力で赤ちゃんが右へ動く', () => {
    const { state } = stepGame(createGameState(DEFAULT_CONFIG), 0.1, DEFAULT_CONFIG, {
      ...noInput,
      right: true,
    });
    expect(state.babyX).toBeGreaterThan(180);
  });
});

describe('stepGame（接触フリーズ中）', () => {
  const frozenState = () => ({
    ...createGameState(DEFAULT_CONFIG),
    contact: { type: 'hurt' as const, t: 0, dur: 0.6 },
  });

  it('距離が加算されない', () => {
    const { state } = stepGame(frozenState(), 0.1, DEFAULT_CONFIG, noInput);
    expect(state.distancePx).toBe(0);
  });

  it('体力が消費されない', () => {
    const { state } = stepGame(frozenState(), 0.1, DEFAULT_CONFIG, noInput);
    expect(state.stamina).toBe(100);
  });

  it('スポーンが起きない', () => {
    const base = { ...frozenState(), spawnAcc: 10 };
    const { state } = stepGame(base, 0.1, DEFAULT_CONFIG, noInput);
    expect(state.objects).toHaveLength(0);
  });

  it('フリーズ中でも横移動は継続する', () => {
    const { state } = stepGame(frozenState(), 0.1, DEFAULT_CONFIG, {
      ...noInput,
      right: true,
    });
    expect(state.babyX).toBeGreaterThan(180);
  });

  it('接触の経過時間は進む', () => {
    const { state } = stepGame(frozenState(), 0.1, DEFAULT_CONFIG, noInput);
    expect(state.contact?.t).toBeCloseTo(0.1);
  });
});

describe('stepGame（スポーン）', () => {
  it('spawnInterval を超えるとオブジェクトが1体生成される', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const base = { ...createGameState(DEFAULT_CONFIG), spawnAcc: DEFAULT_CONFIG.spawnInterval };
    const { state } = stepGame(base, 0.05, DEFAULT_CONFIG, noInput);
    expect(state.objects).toHaveLength(1);
  });
});

describe('stepGame（ゲームオーバー）', () => {
  it('体力が0以下になると over フラグと gameover イベントが立つ', () => {
    const base = { ...createGameState(DEFAULT_CONFIG), stamina: 0.1 };
    const { state, events } = stepGame(base, 0.1, DEFAULT_CONFIG, noInput);
    expect(state.over).toBe(true);
    expect(state.stamina).toBe(0);
    expect(events.some((event) => event.type === 'gameover')).toBe(true);
  });

  it('すでにoverなら gameover イベントを重複発火しない', () => {
    const base = { ...createGameState(DEFAULT_CONFIG), stamina: 0, over: true };
    const { events } = stepGame(base, 0.1, DEFAULT_CONFIG, noInput);
    expect(events.some((event) => event.type === 'gameover')).toBe(false);
  });
});
