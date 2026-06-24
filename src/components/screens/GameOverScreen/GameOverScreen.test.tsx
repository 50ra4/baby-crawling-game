import { fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import { GameOverScreen } from './GameOverScreen';

const baseProps = {
  name: 'たろう',
  resultDistance: 42,
  bestDistance: 99,
  onRetry: () => {},
  onTitle: () => {},
};

describe('GameOverScreen', () => {
  it('ゲームオーバー見出しを表示する', () => {
    const { getByText } = render(<GameOverScreen {...baseProps} />);
    expect(getByText('ゲームオーバー')).toBeInTheDocument();
  });

  it('名前を添えた就寝メッセージを表示する', () => {
    const { getByText } = render(<GameOverScreen {...baseProps} />);
    expect(getByText('たろう は ねむっちゃった')).toBeInTheDocument();
  });

  it('今回の距離とベスト距離を表示する', () => {
    const { getByText } = render(<GameOverScreen {...baseProps} />);
    expect(getByText('42')).toBeInTheDocument();
    expect(getByText('99')).toBeInTheDocument();
  });

  it('「もういっかい」でonRetryが呼ばれる', () => {
    const onRetry = vi.fn();
    const { getByText } = render(
      <GameOverScreen {...baseProps} onRetry={onRetry} />,
    );
    fireEvent.click(getByText('もういっかい'));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('「タイトル」でonTitleが呼ばれる', () => {
    const onTitle = vi.fn();
    const { getByText } = render(
      <GameOverScreen {...baseProps} onTitle={onTitle} />,
    );
    fireEvent.click(getByText('タイトル'));
    expect(onTitle).toHaveBeenCalledOnce();
  });
});
