import type { SfxName } from '../types/game';

const MASTER_GAIN = 0.5;
const BGM_BPM = 70;

type ToneOptions = {
  type?: OscillatorType;
  gain?: number;
  glideTo?: number | null;
};

// 子守唄フレーズ（MIDIノート番号）。C major・2フレーズをループ。
const PHRASES: number[][] = [
  [60, 64, 67, 64, 65, 64, 62, 60],
  [60, 62, 64, 67, 65, 64, 62, 67],
];

const midiToFreq = (note: number): number =>
  440 * Math.pow(2, (note - 69) / 12);

const resolveAudioContext = (): typeof AudioContext => {
  const fallback = window as unknown as {
    webkitAudioContext?: typeof AudioContext;
  };
  return window.AudioContext ?? fallback.webkitAudioContext!;
};

// Web Audio による効果音・BGM 合成。外部音声ファイルは使わない。
export const createGameAudio = () => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let sfxOn = true;
  let bgmOn = false;
  let bgmTimer: ReturnType<typeof setInterval> | null = null;
  let bgmStep = 0;

  const ensure = (): AudioContext => {
    if (!ctx) {
      const Ctor = resolveAudioContext();
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = MASTER_GAIN;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    return ctx;
  };

  // 単音。短いアタックと指数減衰のエンベロープを付ける。
  const tone = (
    freq: number,
    t0: number,
    dur: number,
    options: ToneOptions = {},
  ) => {
    const audioCtx = ctx!;
    const out = master!;
    const { type = 'sine', gain = 0.2, glideTo = null } = options;
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) {
      osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    }
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(env);
    env.connect(out);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  };

  // ローパスをかけた減衰ノイズ（オムツの「ポフ」）。
  const noiseBurst = (t0: number, dur: number, gain = 0.15) => {
    const audioCtx = ctx!;
    const out = master!;
    const length = Math.floor(audioCtx.sampleRate * dur);
    const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    const env = audioCtx.createGain();
    env.gain.value = gain;
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 900;
    source.connect(lowpass);
    lowpass.connect(env);
    env.connect(out);
    source.start(t0);
  };

  const SFX: Record<SfxName, () => void> = {
    bottle() {
      const t = ctx!.currentTime;
      [523.25, 659.25, 783.99].forEach((f, i) =>
        tone(f, t + i * 0.09, 0.18, { type: 'triangle', gain: 0.22 }),
      );
    },
    diaper() {
      const t = ctx!.currentTime;
      tone(300, t, 0.12, { type: 'sine', gain: 0.18, glideTo: 180 });
      noiseBurst(t, 0.12, 0.08);
    },
    toy() {
      const t = ctx!.currentTime;
      [659.25, 880].forEach((f, i) =>
        tone(f, t + i * 0.06, 0.12, { type: 'square', gain: 0.14 }),
      );
    },
    start() {
      const t = ctx!.currentTime;
      tone(523.25, t, 0.12, { type: 'triangle', gain: 0.22 });
      tone(783.99, t + 0.1, 0.16, { type: 'triangle', gain: 0.22 });
    },
    gameover() {
      const t = ctx!.currentTime;
      [659.25, 523.25, 392, 329.63].forEach((f, i) =>
        tone(f, t + i * 0.16, 0.3, { type: 'sine', gain: 0.2 }),
      );
      tone(261.63, t + 0.8, 0.9, { type: 'triangle', gain: 0.18 });
    },
  };

  const bgmTick = () => {
    if (!bgmOn || !ctx) {
      return;
    }
    const phrase = PHRASES.at(Math.floor(bgmStep / 8) % 2)!;
    const index = bgmStep % 8;
    const note = phrase.at(index)!;
    const t = ctx.currentTime;
    tone(midiToFreq(note), t, 0.7, { type: 'triangle', gain: 0.12 });
    // 各フレーズ先頭はオクターブ下を重ねて温かみを出す
    if (index === 0) {
      tone(midiToFreq(note - 12), t, 0.9, { type: 'sine', gain: 0.14 });
    }
    bgmStep += 1;
  };

  return {
    init() {
      ensure();
    },
    setSfx(on: boolean) {
      sfxOn = on;
    },
    setBgm(on: boolean) {
      bgmOn = on;
      if (on) {
        ensure();
        if (!bgmTimer) {
          bgmStep = 0;
          bgmTick();
          bgmTimer = setInterval(bgmTick, 60000 / BGM_BPM / 2);
        }
        return;
      }
      if (bgmTimer) {
        clearInterval(bgmTimer);
        bgmTimer = null;
      }
    },
    sfx(name: SfxName) {
      if (!sfxOn) {
        return;
      }
      ensure();
      SFX[name]();
    },
  };
};

export type GameAudio = ReturnType<typeof createGameAudio>;

// アプリ全体で共有するシングルトン
export const gameAudio = createGameAudio();
