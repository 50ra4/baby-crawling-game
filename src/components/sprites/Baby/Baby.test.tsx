import { render } from '@testing-library/react';
import { Baby } from './Baby';

describe('Baby', () => {
  it('指定サイズのSVGを描画する', () => {
    const { container } = render(<Baby size={120} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('width')).toBe('120');
  });

  it('被弾中は赤いグローのフィルターがかかる', () => {
    const { container } = render(<Baby hurt />);
    const svg = container.querySelector('svg');
    expect(svg?.style.filter).toContain('drop-shadow');
  });

  it('通常時はフィルターがかからない', () => {
    const { container } = render(<Baby hurt={false} />);
    const svg = container.querySelector('svg');
    expect(svg?.style.filter).toBe('none');
  });

  it('ハイハイの種類を変えても描画できる', () => {
    const { container } = render(<Baby crawlStyle="bunny" phase={0.5} />);
    expect(container.querySelector('svg')).not.toBeNull();
  });
});
