import { render } from '@testing-library/react';
import { ObjectSprite } from './ObjectSprite';

describe('ObjectSprite', () => {
  it('哺乳瓶のkindで哺乳瓶SVG(viewBox 52x56)を描画する', () => {
    const { container } = render(<ObjectSprite kind="bottle" size={54} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 52 56');
  });

  it('椅子のkindで椅子SVG(viewBox 52x58)を描画する', () => {
    const { container } = render(<ObjectSprite kind="chair" size={76} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 52 58');
  });

  it('sizeがSVGのwidthに反映される', () => {
    const { container } = render(<ObjectSprite kind="ball" size={54} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('54');
  });

  it('全6種類が描画できる', () => {
    const kinds = [
      'bottle',
      'diaper',
      'chair',
      'ball',
      'teddy',
      'duck',
    ] as const;
    kinds.forEach((kind) => {
      const { container } = render(<ObjectSprite kind={kind} size={50} />);
      expect(container.querySelector('svg')).not.toBeNull();
    });
  });
});
