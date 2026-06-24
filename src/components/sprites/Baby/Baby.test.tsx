import { render } from '@testing-library/react';
import { Baby } from './Baby';

describe('Baby', () => {
  it('指定サイズのimg要素を描画する', () => {
    const { container } = render(<Baby size={120} />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('width')).toBe('120');
  });

  it('被弾中は赤いグローのフィルターがかかる', () => {
    const { container } = render(<Baby hurt />);
    const img = container.querySelector('img');
    expect(img?.style.filter).toContain('drop-shadow');
  });

  it('通常時はフィルターがかからない', () => {
    const { container } = render(<Baby hurt={false} />);
    const img = container.querySelector('img');
    expect(img?.style.filter).toBe('none');
  });

  it('ハイハイの種類を変えても描画できる', () => {
    const { container } = render(<Baby crawlStyle="bunny" phase={0.5} />);
    expect(container.querySelector('img')).not.toBeNull();
  });

  it('heightがwidth×1.18になる', () => {
    const { container } = render(<Baby size={100} />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('height')).toBe(`${100 * 1.18}`);
  });

  it('CSS transformにtranslateとrotateが含まれる', () => {
    const { container } = render(<Baby phase={0.25} crawlStyle="wiggle" />);
    const img = container.querySelector('img');
    expect(img?.style.transform).toMatch(/translate\(/);
    expect(img?.style.transform).toMatch(/rotate\(/);
  });

  it('variant="title"でも描画できる', () => {
    const { container } = render(<Baby variant="title" />);
    expect(container.querySelector('img')).not.toBeNull();
  });

  it('play中もimg要素を描画する', () => {
    const { container } = render(<Baby play phase={0.5} />);
    expect(container.querySelector('img')).not.toBeNull();
  });
});
