import { fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { App } from './App';

// 最小限の AudioContext モック（start時の音声初期化用）
class FakeAudioContext {
  currentTime = 0;
  state = 'running';
  sampleRate = 44100;
  destination = {};
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
      connect() {},
      start() {},
      stop() {},
    };
  }
  createGain() {
    return {
      gain: {
        value: 0,
        setValueAtTime() {},
        exponentialRampToValueAtTime() {},
      },
      connect() {},
    };
  }
  createBiquadFilter() {
    return { type: 'lowpass', frequency: { value: 0 }, connect() {} };
  }
  createBufferSource() {
    return { buffer: null, connect() {}, start() {} };
  }
  createBuffer(_channels: number, length: number) {
    return { getChannelData: () => new Float32Array(length) };
  }
  resume() {
    return Promise.resolve();
  }
}

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

beforeEach(() => {
  localStorage.clear();
  // ゲームループは遷移検証に不要なので rAF を無効化する
  vi.spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(0);
  vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});
  vi.stubGlobal('AudioContext', FakeAudioContext);
  vi.stubGlobal('Image', FakeImage);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('最初はタイトル画面を表示する', () => {
    const { getByText } = render(<App />);
    expect(getByText(/はいはい/)).toBeInTheDocument();
  });

  it('「はじめる」でゲーム画面（HUD表示）に遷移する', async () => {
    const { getByText, container } = render(<App />);
    expect(container.querySelector('.hud')).toBeNull();
    // 画像プリロード完了まで「はじめる」はdisabledのため、活性化を待つ
    await waitFor(() => expect(getByText('はじめる')).not.toBeDisabled());
    fireEvent.click(getByText('はじめる'));
    expect(container.querySelector('.hud')).not.toBeNull();
  });

  it('名前を入力するとlocalStorageに保存される', () => {
    const { getByPlaceholderText } = render(<App />);
    fireEvent.change(getByPlaceholderText('なまえ'), {
      target: { value: 'はな' },
    });
    expect(localStorage.getItem('baby_crawl_name')).toBe('はな');
  });

  it('保存済みのベスト記録をタイトルに表示する', () => {
    localStorage.setItem(
      'baby_crawl_best',
      JSON.stringify({ dist: 120, score: 120 }),
    );
    const { getByText } = render(<App />);
    expect(getByText('ベスト 120m')).toBeInTheDocument();
  });
});
