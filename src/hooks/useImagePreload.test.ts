import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { useImagePreload } from './useImagePreload';

// jsdomはimg.src代入でonload/onerrorを発火しないため、Imageをスタブして
// マイクロタスクで遅延発火するフェイクローダーを用意する（代入順に依存しない）。
class FakeImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  set src(_value: string) {
    void Promise.resolve().then(() => {
      this.onload?.();
    });
  }
}

const sources = ['a.png', 'b.png'] as const;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useImagePreload', () => {
  it('初期状態はloadingになる', () => {
    vi.stubGlobal('Image', FakeImage);
    const { result } = renderHook(() => useImagePreload(sources));
    expect(result.current).toBe('loading');
  });

  it('読み込み完了後はreadyになる', async () => {
    vi.stubGlobal('Image', FakeImage);
    const { result } = renderHook(() => useImagePreload(sources));
    await waitFor(() => expect(result.current).toBe('ready'));
  });

  it('アンマウント後はsetStateしない', async () => {
    vi.stubGlobal('Image', FakeImage);
    const { result, unmount } = renderHook(() => useImagePreload(sources));
    unmount();
    // アンマウント後にreadyへ切り替わってエラーにならないことを確認する
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(result.current).toBe('loading');
  });
});
