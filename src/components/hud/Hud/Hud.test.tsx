import { render } from '@testing-library/react';
import { Hud } from './Hud';

const baseProps = {
  stamina: 100,
  maxStamina: 100,
  discomfort: 0,
  distance: 42,
  bestDistance: 99,
  name: 'たろう',
};

describe('Hud', () => {
  it('現在の距離を表示する', () => {
    const { getByText } = render(<Hud {...baseProps} />);
    expect(getByText('42')).toBeInTheDocument();
  });

  it('ベスト距離を表示する', () => {
    const { getByText } = render(<Hud {...baseProps} />);
    expect(getByText('BEST 99m')).toBeInTheDocument();
  });

  it('名前を表示する', () => {
    const { getByText } = render(<Hud {...baseProps} />);
    expect(getByText('たろう')).toBeInTheDocument();
  });

  it('名前が空なら「あかちゃん」を表示する', () => {
    const { getByText } = render(<Hud {...baseProps} name="" />);
    expect(getByText('あかちゃん')).toBeInTheDocument();
  });

  it('不快度100%で「！パンパン！」を表示する', () => {
    const { getByText } = render(<Hud {...baseProps} discomfort={100} />);
    expect(getByText('！パンパン！')).toBeInTheDocument();
  });

  it('不快度が100%未満なら警告を表示しない', () => {
    const { container } = render(<Hud {...baseProps} discomfort={80} />);
    expect(container.querySelector('.g-warn')).toBeNull();
  });
});
