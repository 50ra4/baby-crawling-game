import { afterEach, vi } from 'vitest';
import { preloadImages } from './preloadImages';

// jsdom は src セットだけでは onload/onerror を自動発火しないため、
// マイクロタスクで発火させる制御可能な Fake Image を用意する。
class FakeImageLoad {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  set src(_value: string) {
    queueMicrotask(() => this.onload?.());
  }
}

class FakeImageError {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  set src(_value: string) {
    queueMicrotask(() => this.onerror?.());
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('preloadImages', () => {
  it('全URLがonloadで解決するとresolveする', async () => {
    vi.stubGlobal('Image', FakeImageLoad);
    await expect(preloadImages(['a.png', 'b.png'])).resolves.toBeUndefined();
  });

  it('空配列を渡すと即resolveする', async () => {
    vi.stubGlobal('Image', FakeImageLoad);
    await expect(preloadImages([])).resolves.toBeUndefined();
  });

  it('onerrorになった画像があってもresolveする（fail-open）', async () => {
    vi.stubGlobal('Image', FakeImageError);
    await expect(preloadImages(['broken.png'])).resolves.toBeUndefined();
  });
});
