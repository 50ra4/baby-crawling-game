import { nextShake } from './shake';

describe('nextShake', () => {
  it('dt/duration の割合で減衰する', () => {
    expect(nextShake(1, 0.15, 0.3)).toBeCloseTo(0.5);
  });

  it('0未満にはならない', () => {
    expect(nextShake(0.1, 0.3, 0.3)).toBe(0);
  });

  it('すでに0なら0のまま', () => {
    expect(nextShake(0, 0.1, 0.3)).toBe(0);
  });

  it('duration が極端に小さくても0でクランプされる', () => {
    expect(nextShake(1, 1, 0.05)).toBe(0);
  });
});
