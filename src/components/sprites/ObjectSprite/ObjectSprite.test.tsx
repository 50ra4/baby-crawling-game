import { render } from '@testing-library/react';
import { ObjectSprite } from './ObjectSprite';

describe('ObjectSprite', () => {
  it('哺乳瓶のkindでimg要素を描画する', () => {
    const { container } = render(<ObjectSprite kind="bottle" size={54} />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
  });

  it('椅子のkindでimg要素を描画する', () => {
    const { container } = render(<ObjectSprite kind="chair" size={76} />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
  });

  it('sizeがimgのwidthに反映される', () => {
    const { container } = render(<ObjectSprite kind="ball" size={54} />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('width')).toBe('54');
  });

  it('sizeがimgのheightにも反映される', () => {
    const { container } = render(<ObjectSprite kind="ball" size={54} />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('height')).toBe('54');
  });

  it('ドラッグ操作を奪わないようdraggable=falseかつpointer-events:noneになる', () => {
    const { container } = render(<ObjectSprite kind="ball" size={52} />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('draggable')).toBe('false');
    expect(img?.style.pointerEvents).toBe('none');
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
      expect(container.querySelector('img')).not.toBeNull();
    });
  });
});
