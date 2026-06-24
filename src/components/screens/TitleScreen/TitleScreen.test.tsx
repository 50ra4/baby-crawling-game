import { fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import { TitleScreen } from './TitleScreen';

const baseProps = {
  name: 'たろう',
  crawlStyle: 'diagonal' as const,
  bounce: 7,
  bestDistance: 0,
  onChangeName: () => {},
  onStart: () => {},
};

describe('TitleScreen', () => {
  it('タイトルロゴを表示する', () => {
    const { getByText } = render(<TitleScreen {...baseProps} />);
    expect(getByText(/はいはい/)).toBeInTheDocument();
  });

  it('名前入力欄に現在の名前が反映される', () => {
    const { getByPlaceholderText } = render(<TitleScreen {...baseProps} />);
    const input = getByPlaceholderText('なまえ') as HTMLInputElement;
    expect(input.value).toBe('たろう');
  });

  it('名前を入力するとonChangeNameが呼ばれる', () => {
    const onChangeName = vi.fn();
    const { getByPlaceholderText } = render(
      <TitleScreen {...baseProps} onChangeName={onChangeName} />,
    );
    fireEvent.change(getByPlaceholderText('なまえ'), {
      target: { value: 'はな' },
    });
    expect(onChangeName).toHaveBeenCalledWith('はな');
  });

  it('「はじめる」ボタンでonStartが呼ばれる', () => {
    const onStart = vi.fn();
    const { getByText } = render(
      <TitleScreen {...baseProps} onStart={onStart} />,
    );
    fireEvent.click(getByText('はじめる'));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('ベスト記録が0より大きいとき表示する', () => {
    const { getByText } = render(
      <TitleScreen {...baseProps} bestDistance={120} />,
    );
    expect(getByText('ベスト 120m')).toBeInTheDocument();
  });

  it('ベスト記録が0のとき表示しない', () => {
    const { queryByText } = render(
      <TitleScreen {...baseProps} bestDistance={0} />,
    );
    expect(queryByText(/ベスト/)).toBeNull();
  });
});
