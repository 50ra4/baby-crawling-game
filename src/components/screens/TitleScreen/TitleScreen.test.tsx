import { fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import { TitleScreen } from './TitleScreen';

const baseProps = {
  name: 'たろう',
  gender: 'girl' as const,
  crawlStyle: 'diagonal' as const,
  bounce: 7,
  bestDistance: 0,
  onChangeName: () => {},
  onChangeGender: () => {},
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

  it('「男の子」を押すとonChangeGenderにboyが渡る', () => {
    const onChangeGender = vi.fn();
    const { getByText } = render(
      <TitleScreen {...baseProps} onChangeGender={onChangeGender} />,
    );
    fireEvent.click(getByText('男の子'));
    expect(onChangeGender).toHaveBeenCalledWith('boy');
  });

  it('「女の子」を押すとonChangeGenderにgirlが渡る', () => {
    const onChangeGender = vi.fn();
    const { getByText } = render(
      <TitleScreen {...baseProps} onChangeGender={onChangeGender} />,
    );
    fireEvent.click(getByText('女の子'));
    expect(onChangeGender).toHaveBeenCalledWith('girl');
  });

  it('選択中の性別ボタンがactiveになる', () => {
    const { getByText } = render(<TitleScreen {...baseProps} gender="boy" />);
    expect(getByText('男の子').className).toContain('active');
    expect(getByText('女の子').className).not.toContain('active');
  });

  it('「あそびかたを みる」でダイアログが開く', () => {
    const { getByText, queryByText } = render(<TitleScreen {...baseProps} />);
    expect(queryByText('そうさ')).toBeNull();
    fireEvent.click(getByText('あそびかたを みる'));
    expect(getByText('そうさ')).toBeInTheDocument();
  });

  it('ダイアログの「とじる」で閉じる', () => {
    const { getByText, queryByText } = render(<TitleScreen {...baseProps} />);
    fireEvent.click(getByText('あそびかたを みる'));
    fireEvent.click(getByText('とじる'));
    expect(queryByText('そうさ')).toBeNull();
  });
});
