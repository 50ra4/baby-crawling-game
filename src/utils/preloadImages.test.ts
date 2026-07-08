import { afterEach, vi } from 'vitest';
import { preloadImages } from './preloadImages';

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

class FakeErrorImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  set src(_value: string) {
    void Promise.resolve().then(() => {
      this.onerror?.();
    });
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('preloadImages', () => {
  it('全画像の読み込み完了でresolveする', async () => {
    vi.stubGlobal('Image', FakeImage);
    await expect(
      preloadImages(['a.png', 'b.png', 'c.png']),
    ).resolves.toBeUndefined();
  });

  it('onerrorが発火してもresolveする（rejectしない）', async () => {
    vi.stubGlobal('Image', FakeErrorImage);
    await expect(preloadImages(['broken.png'])).resolves.toBeUndefined();
  });

  it('空配列のとき即resolveする', async () => {
    vi.stubGlobal('Image', FakeImage);
    await expect(preloadImages([])).resolves.toBeUndefined();
  });
});
