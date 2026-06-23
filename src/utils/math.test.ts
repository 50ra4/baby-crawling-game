import { clamp } from './math';

describe('clamp', () => {
  it('範囲内の値はそのまま返す', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('下限を下回る値は下限に丸める', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it('上限を上回る値は上限に丸める', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('下限ちょうどの値は下限を返す', () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it('上限ちょうどの値は上限を返す', () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('負の範囲でも正しく動作する', () => {
    expect(clamp(-5, -10, -1)).toBe(-5);
    expect(clamp(0, -10, -1)).toBe(-1);
  });
});
