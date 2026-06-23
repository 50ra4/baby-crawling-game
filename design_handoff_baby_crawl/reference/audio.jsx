// audio.jsx — Web Audio API sound synthesis. No external audio files.
// Exposes window.GameAudio singleton: sfx(name), bgmStart(), bgmStop(), setSfx(on), setBgm(on).

const GameAudio = (() => {
  let ctx = null;
  let master = null;
  let sfxOn = true, bgmOn = false;
  let bgmTimer = null;
  let bgmStep = 0;

  function ensure() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // simple tone helper
  function tone(freq, t0, dur, { type = 'sine', gain = 0.2, glideTo = null } = {}) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }

  function noiseBurst(t0, dur, gain = 0.15) {
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain(); g.gain.value = gain;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    src.connect(lp); lp.connect(g); g.connect(master);
    src.start(t0);
  }

  const SFX = {
    bottle() { const t = ctx.currentTime; [523.25, 659.25, 783.99].forEach((f, i) => tone(f, t + i * 0.09, 0.18, { type: 'triangle', gain: 0.22 })); },
    diaper() { const t = ctx.currentTime; tone(300, t, 0.12, { type: 'sine', gain: 0.18, glideTo: 180 }); noiseBurst(t, 0.12, 0.08); },
    obstacle() { const t = ctx.currentTime; tone(180, t, 0.22, { type: 'sawtooth', gain: 0.22, glideTo: 90 }); },
    toy() { const t = ctx.currentTime; [659.25, 880].forEach((f, i) => tone(f, t + i * 0.06, 0.12, { type: 'square', gain: 0.14 })); },
    start() { const t = ctx.currentTime; tone(523.25, t, 0.12, { type: 'triangle', gain: 0.22 }); tone(783.99, t + 0.1, 0.16, { type: 'triangle', gain: 0.22 }); },
    gameover() {
      const t = ctx.currentTime;
      [659.25, 523.25, 392, 329.63].forEach((f, i) => tone(f, t + i * 0.16, 0.3, { type: 'sine', gain: 0.2 }));
      tone(261.63, t + 0.8, 0.9, { type: 'triangle', gain: 0.18 });
    },
  };

  // lullaby: C major, ~70 BPM, two 8-note phrases looping, octave-down on downbeat
  const PHRASES = [
    [60, 64, 67, 64, 65, 64, 62, 60],
    [60, 62, 64, 67, 65, 64, 62, 67],
  ];
  const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function bgmTick() {
    if (!bgmOn) return;
    const phrase = PHRASES[Math.floor(bgmStep / 8) % 2];
    const i = bgmStep % 8;
    const note = phrase[i];
    const t = ctx.currentTime;
    tone(midi(note), t, 0.7, { type: 'triangle', gain: 0.12 });
    if (i === 0) tone(midi(note - 12), t, 0.9, { type: 'sine', gain: 0.14 }); // warm downbeat octave
    bgmStep++;
  }

  return {
    init() { ensure(); },
    setSfx(on) { sfxOn = on; },
    setBgm(on) {
      bgmOn = on;
      if (on) { ensure(); if (!bgmTimer) { bgmStep = 0; bgmTick(); bgmTimer = setInterval(bgmTick, 60000 / 70 / 2); } }
      else if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }
    },
    sfx(name) { if (!sfxOn) return; ensure(); SFX[name] && SFX[name](); },
  };
})();

window.GameAudio = GameAudio;
