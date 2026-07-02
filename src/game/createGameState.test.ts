import { createGameState } from './createGameState';
import { DEFAULT_CONFIG } from '../constants/gameConfig';

describe('createGameState', () => {
  it('赤ちゃんが画面中央(180)・速度0から始まる', () => {
    const state = createGameState(DEFAULT_CONFIG);
    expect(state.babyX).toBe(180);
    expect(state.babyVx).toBe(0);
  });

  it('体力が初期体力で満タンになる', () => {
    const state = createGameState(DEFAULT_CONFIG);
    expect(state.stamina).toBe(DEFAULT_CONFIG.staminaStart);
    expect(state.maxStamina).toBe(DEFAULT_CONFIG.staminaStart);
  });

  it('不快度・距離・スコアが0で始まる', () => {
    const state = createGameState(DEFAULT_CONFIG);
    expect(state.discomfort).toBe(0);
    expect(state.distancePx).toBe(0);
    expect(state.score).toBe(0);
  });

  it('オブジェクト・ポップアップが空で接触がない', () => {
    const state = createGameState(DEFAULT_CONFIG);
    expect(state.objects).toEqual([]);
    expect(state.popups).toEqual([]);
    expect(state.contact).toBeNull();
  });

  it('スポーンアキュムレータが全て0から始まる', () => {
    const state = createGameState(DEFAULT_CONFIG);
    expect(state.toySpawnAcc).toBe(0);
    expect(state.bottleAcc).toBe(0);
    expect(state.diaperAcc).toBe(0);
  });

  it('ゲームオーバーフラグが立っていない', () => {
    const state = createGameState(DEFAULT_CONFIG);
    expect(state.over).toBe(false);
  });

  it('体力をカスタムした設定を反映する', () => {
    const state = createGameState({ ...DEFAULT_CONFIG, staminaStart: 150 });
    expect(state.stamina).toBe(150);
    expect(state.maxStamina).toBe(150);
  });
});
