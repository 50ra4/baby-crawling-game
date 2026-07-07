import { fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { App } from './App';

// jsdom は src セットだけでは onload を自動発火しないため、
// マイクロタスクで発火させる制御可能な Fake Image を用意する。
class FakeImageLoad {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  set src(_value: string) {
    queueMicrotask(() => this.onload?.());
  }
}

// onloadを保留し続け、プリロード未完了状態を再現するための Fake Image。
class FakeImagePending {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  set src(_value: string) {
    // 意図的に onload を発火させない
  }
}

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

beforeEach(() => {
  localStorage.clear();
  // ゲームループは遷移検証に不要なので rAF を無効化する
  vi.spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(0);
  vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});
  vi.stubGlobal('AudioContext', FakeAudioContext);
  vi.stubGlobal('Image', FakeImageLoad);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('最初はタイトル画面を表示する', async () => {
    const { getByText } = render(<App />);
    expect(getByText(/はいはい/)).toBeInTheDocument();
    await waitFor(() => expect(getByText('はじめる')).toBeInTheDocument());
  });

  it('「はじめる」でゲーム画面（HUD表示）に遷移する', async () => {
    const { findByText, container } = render(<App />);
    expect(container.querySelector('.hud')).toBeNull();
    const startBtn = await findByText('はじめる');
    fireEvent.click(startBtn);
    expect(container.querySelector('.hud')).not.toBeNull();
  });

  it('名前を入力するとlocalStorageに保存される', async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    fireEvent.change(getByPlaceholderText('なまえ'), {
      target: { value: 'はな' },
    });
    expect(localStorage.getItem('baby_crawl_name')).toBe('はな');
    await waitFor(() => expect(getByText('はじめる')).toBeInTheDocument());
  });

  it('保存済みのベスト記録をタイトルに表示する', async () => {
    localStorage.setItem(
      'baby_crawl_best',
      JSON.stringify({ dist: 120, score: 120 }),
    );
    const { getByText } = render(<App />);
    expect(getByText('ベスト 120m')).toBeInTheDocument();
    await waitFor(() => expect(getByText('はじめる')).toBeInTheDocument());
  });

  it('画像プリロード未完了時は「よみこみ中…」表示でボタンが無効、クリックしてもゲーム画面に遷移しない', () => {
    vi.stubGlobal('Image', FakeImagePending);
    const { getByText, container } = render(<App />);
    const startBtn = getByText('よみこみ中…') as HTMLButtonElement;
    expect(startBtn.disabled).toBe(true);
    fireEvent.click(startBtn);
    expect(container.querySelector('.hud')).toBeNull();
  });
});
