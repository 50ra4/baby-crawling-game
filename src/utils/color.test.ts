import { mixColor, shade } from './color';

describe('shade', () => {
  it('正の量で明るくなる', () => {
    expect(shade('#808080', 0.1)).toBe('#9a9a9a');
  });

  it('負の量で暗くなる', () => {
    expect(shade('#808080', -0.1)).toBe('#676767');
  });

  it('白を明るくしても255でクランプされる', () => {
    expect(shade('#ffffff', 0.5)).toBe('#ffffff');
  });

  it('黒を暗くしても0でクランプされる', () => {
    expect(shade('#000000', -0.5)).toBe('#000000');
  });

  it('3桁の短縮hexを6桁に展開して処理する', () => {
    expect(shade('#fff', -0.5)).toBe(shade('#ffffff', -0.5));
  });

  it('量0なら色は変わらない', () => {
    expect(shade('#ffd9bf', 0)).toBe('#ffd9bf');
  });
});

describe('mixColor', () => {
  it('比率0なら1つ目の色を返す', () => {
    expect(mixColor('#000000', '#ffffff', 0)).toBe('#000000');
  });

  it('比率1なら2つ目の色を返す', () => {
    expect(mixColor('#000000', '#ffffff', 1)).toBe('#ffffff');
  });

  it('比率0.5なら中間色(グレー)を返す', () => {
    expect(mixColor('#000000', '#ffffff', 0.5)).toBe('#808080');
  });

  it('チャンネルごとに線形補間する', () => {
    expect(mixColor('#9ad6c0', '#3a5a4a', 0)).toBe('#9ad6c0');
    expect(mixColor('#9ad6c0', '#3a5a4a', 1)).toBe('#3a5a4a');
  });
});
