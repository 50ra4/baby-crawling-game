import { fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import { HelpDialog } from './HelpDialog';

describe('HelpDialog', () => {
  it('見出しと操作・ステータス・スコア・おもちゃ・アイテムの説明を表示する', () => {
    const { getByText, container } = render(<HelpDialog onClose={() => {}} />);
    expect(getByText('あそびかた')).toBeInTheDocument();
    const text = container.textContent ?? '';
    expect(text).toContain('体力');
    expect(text).toContain('おむつ');
    expect(text).toContain('きょり');
    expect(text).toContain('ボール');
    expect(text).toContain('哺乳瓶');
    expect(text).toContain('オムツ');
    expect(text).toContain('-8');
    expect(text).toContain('+20%');
  });

  it('きょりを「ステータス」ではなく「スコア」として見せる', () => {
    const { getByRole } = render(<HelpDialog onClose={() => {}} />);
    // 「スコア」見出しが存在する
    expect(
      getByRole('heading', { name: 'スコア' }),
    ).toBeInTheDocument();
  });

  it('おもちゃ・アイテムをそれぞれ画像つきで表示する', () => {
    const { container } = render(<HelpDialog onClose={() => {}} />);
    // ボール・テディベア・アヒル・哺乳瓶・オムツの5種ぶんのスプライト画像
    expect(container.querySelectorAll('img')).toHaveLength(5);
  });

  it('「とじる」でonCloseが呼ばれる', () => {
    const onClose = vi.fn();
    const { getByText } = render(<HelpDialog onClose={onClose} />);
    fireEvent.click(getByText('とじる'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('背景クリックでonCloseが呼ばれる', () => {
    const onClose = vi.fn();
    const { container } = render(<HelpDialog onClose={onClose} />);
    const backdrop = container.querySelector('.help-backdrop');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop as Element);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('パネル内クリックではonCloseが呼ばれない（伝播を止める）', () => {
    const onClose = vi.fn();
    const { container } = render(<HelpDialog onClose={onClose} />);
    const panel = container.querySelector('.help-panel');
    expect(panel).not.toBeNull();
    fireEvent.click(panel as Element);
    expect(onClose).not.toHaveBeenCalled();
  });
});
