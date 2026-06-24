import { render } from '@testing-library/react';
import { PopupText } from './PopupText';
import type { Popup } from '../../types/game';

const popup: Popup = {
  id: 1,
  text: '+体力',
  color: '#37b24d',
  x: 100,
  y: 200,
  t: 0,
};

describe('PopupText', () => {
  it('テキストと色を表示する', () => {
    const { getByText } = render(<PopupText popup={popup} />);
    const el = getByText('+体力');
    expect(el).toBeInTheDocument();
    expect(el.style.color).toBe('rgb(55, 178, 77)');
  });

  it('時間経過で不透明度が下がる', () => {
    const { getByText } = render(<PopupText popup={{ ...popup, t: 0.55 }} />);
    const el = getByText('+体力');
    expect(Number(el.style.opacity)).toBeCloseTo(0.5, 1);
  });
});
