import { render } from '@testing-library/react';
import { SleepingBaby } from './SleepingBaby';

describe('SleepingBaby', () => {
  it('デフォルトサイズのimg要素を描画する', () => {
    const { container } = render(<SleepingBaby />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('width')).toBe('230');
  });

  it('heightがwidth×0.72になる', () => {
    const { container } = render(<SleepingBaby size={200} />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('height')).toBe(`${200 * 0.72}`);
  });

  it('t=0のとき呼吸アニメーションのオフセットが0', () => {
    const { container } = render(<SleepingBaby t={0} />);
    const img = container.querySelector('img');
    expect(img?.style.transform).toBe('translateY(0px)');
  });

  it('t>0のとき呼吸アニメーションでtranslateYが変化する', () => {
    const { container } = render(<SleepingBaby t={1} />);
    const img = container.querySelector('img');
    expect(img?.style.transform).toMatch(/translateY\(.+px\)/);
    expect(img?.style.transform).not.toBe('translateY(0px)');
  });
});
