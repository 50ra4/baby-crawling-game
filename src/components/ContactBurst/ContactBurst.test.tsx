import { render } from '@testing-library/react';
import { ContactBurst } from './ContactBurst';

describe('ContactBurst', () => {
  it('遊ぶ(play)では「わーい！」を表示する', () => {
    const { getByText } = render(<ContactBurst type="play" x={0} y={0} />);
    expect(getByText('わーい！')).toBeInTheDocument();
  });

  it('typeに応じたクラスが付く', () => {
    const { container } = render(<ContactBurst type="play" x={0} y={0} />);
    expect(container.querySelector('.contact-burst.play')).not.toBeNull();
  });
});
