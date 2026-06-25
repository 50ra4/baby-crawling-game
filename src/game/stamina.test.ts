import { nextDiscomfort, nextStamina } from './stamina';
import { DEFAULT_CONFIG, PX_PER_M } from '../constants/gameConfig';

describe('nextStamina', () => {
  it('進んだ距離(m)に比例して staminaPerMeter 分だけ減少する', () => {
    // 38px = 1m。1m進むと staminaPerMeter(0.35) 分消費する。
    const result = nextStamina(100, 0, PX_PER_M, DEFAULT_CONFIG);
    expect(result).toBeCloseTo(100 - DEFAULT_CONFIG.staminaPerMeter);
  });

  it('不快度がしきい値以上だと消費が drainMultiplier 倍になる', () => {
    const result = nextStamina(100, 80, PX_PER_M, DEFAULT_CONFIG);
    expect(result).toBeCloseTo(
      100 - DEFAULT_CONFIG.staminaPerMeter * DEFAULT_CONFIG.drainMultiplier,
    );
  });

  it('不快度がしきい値未満なら等倍のまま', () => {
    const result = nextStamina(100, 79, PX_PER_M, DEFAULT_CONFIG);
    expect(result).toBeCloseTo(100 - DEFAULT_CONFIG.staminaPerMeter);
  });

  it('進んだ距離に比例する（半分の距離なら消費も半分）', () => {
    const result = nextStamina(100, 0, PX_PER_M / 2, DEFAULT_CONFIG);
    expect(result).toBeCloseTo(100 - DEFAULT_CONFIG.staminaPerMeter / 2);
  });

  it('距離が0なら消費しない', () => {
    const result = nextStamina(100, 0, 0, DEFAULT_CONFIG);
    expect(result).toBe(100);
  });
});

describe('nextDiscomfort', () => {
  it('discomfortFillSec 秒で0から100へ上昇する速さで増える', () => {
    // 30秒で100 → 1秒で 100/30 ≈ 3.333 上昇
    const result = nextDiscomfort(0, 1, DEFAULT_CONFIG);
    expect(result).toBeCloseTo(100 / DEFAULT_CONFIG.discomfortFillSec);
  });

  it('100で頭打ちになる', () => {
    const result = nextDiscomfort(99, 5, DEFAULT_CONFIG);
    expect(result).toBe(100);
  });

  it('既に100なら100のまま', () => {
    const result = nextDiscomfort(100, 1, DEFAULT_CONFIG);
    expect(result).toBe(100);
  });
});
