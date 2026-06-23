import { discomfortColor, staminaColor } from './gaugeColor';

describe('staminaColor', () => {
  it('残量50%超は赤(#ff6b81)', () => {
    expect(staminaColor(0.6)).toBe('#ff6b81');
  });

  it('残量25%超50%以下は橙(#ff9f43)', () => {
    expect(staminaColor(0.4)).toBe('#ff9f43');
  });

  it('残量25%以下は暗赤(#a4313f)', () => {
    expect(staminaColor(0.2)).toBe('#a4313f');
  });

  it('境界値50%は橙側になる', () => {
    expect(staminaColor(0.5)).toBe('#ff9f43');
  });
});

describe('discomfortColor', () => {
  it('0%ではミント色を返す', () => {
    expect(discomfortColor(0)).toBe('#9ad6c0');
  });

  it('100%では深緑を返す', () => {
    expect(discomfortColor(1)).toBe('#3a5a4a');
  });
});
