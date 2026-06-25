import { afterEach, vi } from 'vitest';
import { stepGame } from './gameStep';
import { createGameState } from './createGameState';
import { DEFAULT_CONFIG } from '../constants/gameConfig';
import type { GameState, InputState } from '../types/game';

const noInput: InputState = {
  left: false,
  right: false,
  targetX: null,
};

const FRAME_DT = 1 / 60;

// 入力なしで指定フレーム数だけ通しプレイする
const simulate = (frames: number): GameState => {
  let state = createGameState(DEFAULT_CONFIG);
  for (let i = 0; i < frames; i += 1) {
    state = stepGame(state, FRAME_DT, DEFAULT_CONFIG, noInput).state;
  }
  return state;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ゲーム全体の通しプレイ', () => {
  it('障害物が遠いレーンに出続ける条件では体力が尽きてゲームオーバーになる', () => {
    // Math.random=0 で椅子(障害物)がレーン0に出続け、中央の赤ちゃんに当たらない
    vi.spyOn(Math, 'random').mockReturnValue(0);
    // 既定値では約35秒で体力切れ。40秒(2400フレーム)シミュレートする。
    // ゲームオーバー後もループを回し続けると体力は負に振れる（実機ではループが
    // 停止するため不可視）。ここではゲームオーバーに到達することを確認する。
    const state = simulate(2400);
    expect(state.over).toBe(true);
    expect(state.stamina).toBeLessThanOrEqual(0);
  });

  it('プレイ中は距離が伸び、オブジェクトがスポーンする', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    // 5秒(300フレーム)プレイ。まだ生存しているはず。
    const state = simulate(300);
    expect(state.over).toBe(false);
    expect(state.distancePx).toBeGreaterThan(0);
    expect(state.score).toBeGreaterThan(0);
    expect(state.objects.length).toBeGreaterThan(0);
  });

  it('不快度はしきい値を超えて上昇し100%で頭打ちになる', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    // 30秒時点では不快度は100%に張り付いている（4/秒で上昇し25秒で到達）
    const state = simulate(1800);
    expect(state.discomfort).toBe(100);
  });
});
