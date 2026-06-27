import { act, renderHook } from '@testing-library/react';
import { useModal } from './useModal';

describe('useModal', () => {
  it('初期状態は閉じている', () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.isOpen).toBe(false);
  });

  it('openで開き、closeで閉じる', () => {
    const { result } = renderHook(() => useModal());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('表示中はEscキーで閉じる', () => {
    const { result } = renderHook(() => useModal());
    act(() => result.current.open());
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('閉じている間のEscキーでは何も起きない（リスナ未登録）', () => {
    const { result } = renderHook(() => useModal());
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('閉じたとき開く前のフォーカス要素へ戻す', () => {
    const opener = document.createElement('button');
    const inside = document.createElement('button');
    document.body.append(opener, inside);
    opener.focus();

    const { result } = renderHook(() => useModal());
    act(() => result.current.open()); // この時点のフォーカス(opener)を記憶
    inside.focus(); // ダイアログ内へフォーカスが移った状況を再現
    expect(document.activeElement).toBe(inside);

    act(() => result.current.close());
    expect(document.activeElement).toBe(opener);

    opener.remove();
    inside.remove();
  });
});
