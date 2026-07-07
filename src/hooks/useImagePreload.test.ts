import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { useImagePreload } from './useImagePreload';

// jsdom は src セットだけでは onload を自動発火しないため、
// マイクロタスクで発火させる制御可能な Fake Image を用意する。
class FakeImageLoad {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  set src(_value: string) {
    queueMicrotask(() => this.onload?.());
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useImagePreload', () => {
  it('初期状態はfalseで、読み込み完了後にtrueになる', async () => {
    vi.stubGlobal('Image', FakeImageLoad);
    const { result } = renderHook(() => useImagePreload(['a.png', 'b.png']));

    expect(result.current).toBe(false);

    await waitFor(() => expect(result.current).toBe(true));
  });
});
