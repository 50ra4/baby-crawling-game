import { afterEach, beforeEach, vi } from 'vitest';
import { createGameAudio } from './gameAudio';

// 生成されたノード数を記録する簡易な AudioContext モック
const created = { oscillators: 0, bufferSources: 0 };

class FakeAudioParam {
  value = 0;
  setValueAtTime() {
    return this;
  }
  exponentialRampToValueAtTime() {
    return this;
  }
}

class FakeOscillator {
  type = 'sine';
  frequency = new FakeAudioParam();
  connect() {}
  start() {}
  stop() {}
}

class FakeGain {
  gain = new FakeAudioParam();
  connect() {}
}

class FakeFilter {
  type = 'lowpass';
  frequency = new FakeAudioParam();
  connect() {}
}

class FakeBufferSource {
  buffer: unknown = null;
  connect() {}
  start() {}
}

class FakeAudioContext {
  currentTime = 0;
  state = 'running';
  sampleRate = 44100;
  destination = {};
  createOscillator() {
    created.oscillators += 1;
    return new FakeOscillator();
  }
  createGain() {
    return new FakeGain();
  }
  createBiquadFilter() {
    return new FakeFilter();
  }
  createBufferSource() {
    created.bufferSources += 1;
    return new FakeBufferSource();
  }
  createBuffer(_channels: number, length: number) {
    return { getChannelData: () => new Float32Array(length) };
  }
  resume() {
    return Promise.resolve();
  }
}

beforeEach(() => {
  created.oscillators = 0;
  created.bufferSources = 0;
  vi.stubGlobal('AudioContext', FakeAudioContext);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('gameAudio', () => {
  it('init() がエラーを投げない', () => {
    const audio = createGameAudio();
    expect(() => audio.init()).not.toThrow();
  });

  it('哺乳瓶SEは上昇3音のオシレータを生成する', () => {
    const audio = createGameAudio();
    audio.sfx('bottle');
    expect(created.oscillators).toBe(3);
  });

  it('オムツSEはノイズ用のバッファソースを生成する', () => {
    const audio = createGameAudio();
    audio.sfx('diaper');
    expect(created.bufferSources).toBe(1);
  });

  it('効果音OFFのときは何も鳴らさない', () => {
    const audio = createGameAudio();
    audio.setSfx(false);
    audio.sfx('bottle');
    expect(created.oscillators).toBe(0);
  });

  it('効果音を再びONにすると鳴る', () => {
    const audio = createGameAudio();
    audio.setSfx(false);
    audio.setSfx(true);
    audio.sfx('toy');
    expect(created.oscillators).toBeGreaterThan(0);
  });

  it('BGMをONにすると音が鳴り、OFFで停止する', () => {
    vi.useFakeTimers();
    const audio = createGameAudio();

    audio.setBgm(true);
    expect(created.oscillators).toBeGreaterThan(0);

    vi.advanceTimersByTime(500);
    const afterPlaying = created.oscillators;
    expect(afterPlaying).toBeGreaterThan(0);

    audio.setBgm(false);
    const afterStop = created.oscillators;
    vi.advanceTimersByTime(2000);
    expect(created.oscillators).toBe(afterStop);
  });
});
