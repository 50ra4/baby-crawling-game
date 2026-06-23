import { nextDiscomfort, nextStamina } from './stamina';
import { DEFAULT_CONFIG } from '../constants/gameConfig';

describe('nextStamina', () => {
  it('1秒あたり drainPerSec 分だけ減少する', () => {
    const result = nextStamina(100, 0, 1, DEFAULT_CONFIG);
    expect(result).toBe(100 - DEFAULT_CONFIG.drainPerSec);
  });

  it('不快度がしきい値以上だと消費が drainMultiplier 倍になる', () => {
    const result = nextStamina(100, 80, 1, DEFAULT_CONFIG);
    expect(result).toBe(100 - DEFAULT_CONFIG.drainPerSec * DEFAULT_CONFIG.drainMultiplier);
  });

  it('不快度がしきい値未満なら等倍のまま', () => {
    const result = nextStamina(100, 79, 1, DEFAULT_CONFIG);
    expect(result).toBe(100 - DEFAULT_CONFIG.drainPerSec);
  });

  it('dtに比例して消費する', () => {
    const result = nextStamina(100, 0, 0.5, DEFAULT_CONFIG);
    expect(result).toBe(100 - DEFAULT_CONFIG.drainPerSec * 0.5);
  });
});

describe('nextDiscomfort', () => {
  it('体力消費の2倍の速さで上昇する', () => {
    const result = nextDiscomfort(0, 1, DEFAULT_CONFIG);
    expect(result).toBe(DEFAULT_CONFIG.drainPerSec * 2);
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
