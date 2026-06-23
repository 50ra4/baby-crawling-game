import { render } from '@testing-library/react';
import { Gauge } from './Gauge';

describe('Gauge', () => {
  it('ratioに応じて塗り幅が決まる', () => {
    const { container } = render(<Gauge icon="❤️" ratio={0.5} color="#ff6b81" />);
    const fill = container.querySelector<HTMLElement>('.g-fill');
    expect(fill?.style.width).toBe('50%');
  });

  it('ratioが範囲外でも0〜100%にクランプされる', () => {
    const { container } = render(<Gauge icon="❤️" ratio={1.5} color="#ff6b81" />);
    const fill = container.querySelector<HTMLElement>('.g-fill');
    expect(fill?.style.width).toBe('100%');
  });

  it('警告テキストを渡すと表示される', () => {
    const { getByText } = render(
      <Gauge icon="🧷" ratio={1} color="#3a5a4a" warn="！パンパン！" />,
    );
    expect(getByText('！パンパン！')).toBeInTheDocument();
  });

  it('警告テキストがなければ表示しない', () => {
    const { container } = render(<Gauge icon="🧷" ratio={0.5} color="#9ad6c0" />);
    expect(container.querySelector('.g-warn')).toBeNull();
  });
});
