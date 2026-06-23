// game.jsx — core game loop, collision, HUD, input. Mounts <App/>.
// Reads live tweak values via a ref so the rAF loop always sees the latest.
// Screens (title / game over / spec) + tweaks panel content live in screens.jsx.

const { useState, useRef, useEffect, useCallback } = React;

// logical canvas (9:17 portrait)
const W = 360, H = 680;
const BABY_Y = H * 0.70;
const BABY_W = 96;
const PX_PER_M = 38;            // px scrolled per in-game meter
window.PX_PER_M = PX_PER_M;     // shared with screens.jsx (separate babel scope)
const LANES = 5;
const MARGIN = 48;
const laneX = (i) => MARGIN + (i * (W - 2 * MARGIN)) / (LANES - 1);

// kinds grouped by category for spawn selection
const KINDS = {
  obstacle: ['chair'],
  toy: ['ball', 'teddy', 'duck'],
  item: ['bottle', 'diaper'],
};

function newGameState(t) {
  return {
    babyX: W / 2, targetX: W / 2,
    stamina: t.staminaStart, maxStamina: t.staminaStart,
    discomfort: 0,
    distancePx: 0, score: 0,
    objects: [], nextId: 1,
    spawnAcc: 0,
    phase: 0,
    contact: null,             // {type:'hurt'|'play', t, dur}
    invincibleUntil: -1,
    invincibleType: null,      // 'hurt' | 'play' — only 'hurt' blinks
    shake: 0,
    popups: [], popId: 1,
    elapsed: 0,
    over: false,
  };
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const tRef = useRef(t); tRef.current = t;

  const [screen, setScreen] = useState('title');   // title | playing | over
  const [, force] = useState(0);
  const rerender = useCallback(() => force((n) => n + 1), []);

  const G = useRef(newGameState(t));
  const keys = useRef({ left: false, right: false });
  const dragging = useRef(false);
  const lastResult = useRef({ score: 0, dist: 0 });
  const best = useRef(loadBest());

  // sync sound tweaks
  useEffect(() => { GameAudio.setSfx(t.sfxOn); }, [t.sfxOn]);
  useEffect(() => { if (screen === 'playing') GameAudio.setBgm(t.bgmOn); else GameAudio.setBgm(false); }, [t.bgmOn, screen]);

  // ── start / restart ──
  const start = useCallback(() => {
    GameAudio.init(); GameAudio.sfx('start');
    G.current = newGameState(tRef.current);
    setScreen('playing');
    GameAudio.setBgm(tRef.current.bgmOn);
  }, []);

  const toTitle = useCallback(() => { GameAudio.setBgm(false); setScreen('title'); }, []);

  // ── input ──
  useEffect(() => {
    const kd = (e) => {
      if (e.repeat) return;
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) keys.current.left = true;
      else if (['ArrowRight', 'd', 'D'].includes(e.key)) keys.current.right = true;
      else if ([' ', 'Enter'].includes(e.key)) {
        if (screen === 'title') start();
        else if (screen === 'over') start();
      }
    };
    const ku = (e) => {
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) keys.current.left = false;
      else if (['ArrowRight', 'd', 'D'].includes(e.key)) keys.current.right = false;
    };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  }, [screen, start]);

  const stageRef = useRef(null);
  const pointerToLogical = (clientX) => {
    const el = stageRef.current; if (!el) return W / 2;
    const r = el.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * W;
  };
  const onPointerDown = (e) => { if (screen !== 'playing') return; dragging.current = true; G.current.targetX = clamp(pointerToLogical(e.clientX), MARGIN, W - MARGIN); };
  const onPointerMove = (e) => { if (dragging.current) G.current.targetX = clamp(pointerToLogical(e.clientX), MARGIN, W - MARGIN); };
  const onPointerUp = () => { dragging.current = false; };

  // ── game loop ──
  useEffect(() => {
    let raf, last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (screen === 'playing') step(dt);
      rerender();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [screen]);

  function step(dt) {
    const g = G.current, T = tRef.current;
    g.elapsed += dt;

    // crawl phase (couples slightly to scroll speed)
    g.phase = (g.phase + T.crawlCyclesPerSec * (T.scrollSpeed / 200) * dt) % 1;

    // contact animation freezes scoring + distance
    const frozen = !!g.contact;
    if (g.contact) { g.contact.t += dt; if (g.contact.t >= g.contact.dur) g.contact = null; }

    // horizontal movement
    if (keys.current.left || keys.current.right) {
      const dir = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0);
      g.babyX = clamp(g.babyX + dir * T.babyMoveSpeed * dt, MARGIN, W - MARGIN);
      g.targetX = g.babyX;
    } else if (dragging.current) {
      const d = g.targetX - g.babyX;
      const mv = T.babyMoveSpeed * dt;
      g.babyX += clamp(d, -mv, mv);
    }

    if (!frozen) {
      const dpx = T.scrollSpeed * dt;
      g.distancePx += dpx;
      g.score = Math.floor(g.distancePx / PX_PER_M);
      // stamina drains with TIME (x2 while uncomfortable); discomfort rises at 2x that base rate
      const mult = g.discomfort >= T.discomfortThreshold ? T.drainMultiplier : 1;
      g.stamina -= T.drainPerSec * dt * mult;
      g.discomfort = Math.min(100, g.discomfort + (T.drainPerSec * 2) * dt);

      // scroll + dynamic objects (move diagonally, bounce off side walls)
      for (const o of g.objects) {
        const dyn = OBJECT_META[o.kind].dyn;
        const extra = dyn ? T.scrollSpeed * 0.5 : 0;
        o.y += (T.scrollSpeed + extra) * dt;
        if (dyn) {
          o.x += o.vx * dt;
          if (o.x < 26) { o.x = 26; o.vx = Math.abs(o.vx); }
          else if (o.x > W - 26) { o.x = W - 26; o.vx = -Math.abs(o.vx); }
        }
      }
      g.objects = g.objects.filter((o) => o.y < H + 80);

      // spawn
      g.spawnAcc += dt;
      if (g.spawnAcc >= T.spawnInterval) { g.spawnAcc -= T.spawnInterval; spawn(g, T); }

      // collisions
      const now = g.elapsed;
      for (const o of g.objects) {
        if (o.hit) continue;
        const r = OBJECT_META[o.kind].base * o.scale * 0.42;
        const dx = Math.abs(o.x - g.babyX), dy = Math.abs(o.y - BABY_Y);
        if (dx < r + 24 && dy < r + 26) {
          const meta = OBJECT_META[o.kind];
          if (meta.cat === 'item') { o.hit = true; collectItem(g, T, o); }
          else if (now > g.invincibleUntil) { o.hit = true; hitObject(g, T, o, meta); }
        }
      }
    }

    // shake decay
    g.shake = Math.max(0, g.shake - dt / Math.max(0.05, T.shakeDuration));

    // popups
    for (const p of g.popups) p.t += dt;
    g.popups = g.popups.filter((p) => p.t < 1.1);

    // game over
    if (g.stamina <= 0 && !g.over) {
      g.stamina = 0; g.over = true;
      GameAudio.sfx('gameover'); GameAudio.setBgm(false);
      const dist = Math.floor(g.distancePx / PX_PER_M);
      lastResult.current = { score: dist, dist };
      const b = best.current;
      if (dist > b.dist) { best.current = { dist, score: dist }; saveBest(best.current); }
      setTimeout(() => setScreen('over'), 350);
    }
  }

  function spawn(g, T) {
    const r = Math.random() * (T.obstacleRate + T.toyRate + T.itemRate);
    let cat;
    if (r < T.obstacleRate) cat = 'obstacle';
    else if (r < T.obstacleRate + T.toyRate) cat = 'toy';
    else cat = 'item';
    let kind;
    if (cat === 'item') kind = Math.random() * 100 < T.bottleShare ? 'bottle' : 'diaper';
    else { const list = KINDS[cat]; kind = list[Math.floor(Math.random() * list.length)]; }
    const lane = Math.floor(Math.random() * LANES);
    const meta = OBJECT_META[kind];
    const scale = 1;                                     // uniform size per object (size class set by base)
    // dynamic objects drift diagonally (not straight down)
    const vx = meta.dyn ? (Math.random() < 0.5 ? -1 : 1) * T.scrollSpeed * (0.28 + Math.random() * 0.3) : 0;
    g.objects.push({ id: g.nextId++, kind, x: laneX(lane), y: -44, hit: false, scale, vx });
  }

  function collectItem(g, T, o) {
    if (o.kind === 'bottle') {
      g.stamina = Math.min(g.maxStamina, g.stamina + g.maxStamina * (T.bottleHealPct / 100));
      pop(g, `+体力`, '#37b24d', o.x, o.y); GameAudio.sfx('bottle');
    } else {
      g.discomfort = 0;
      pop(g, `おむつ交換！`, '#2f86d6', o.x, o.y); GameAudio.sfx('diaper');
    }
  }

  function hitObject(g, T, o, meta) {
    g.stamina -= (meta.cat === 'obstacle' ? T.obstacleDamage : T.toyDamage);
    g.invincibleUntil = g.elapsed + T.invincibleTime;
    if (meta.cat === 'obstacle') {
      g.invincibleType = 'hurt';
      g.contact = { type: 'hurt', t: 0, dur: T.contactTime };
      g.shake = 1;
      pop(g, 'いたっ！', '#e8503a', o.x, o.y); GameAudio.sfx('obstacle');
    } else {
      g.invincibleType = 'play';
      g.contact = { type: 'play', t: 0, dur: T.contactTime };
      pop(g, '遊んじゃった！', '#e88b1a', o.x, o.y); GameAudio.sfx('toy');
    }
  }

  function pop(g, text, color, x, y) { g.popups.push({ id: g.popId++, text, color, x, y }); }

  // ── render ──
  const g = G.current;
  // blink only on damage (hurt) invincibility — playing with a toy never blinks
  const blinking = g.invincibleType === 'hurt' && g.elapsed < g.invincibleUntil && Math.floor(g.elapsed * 12) % 2 === 0;
  const shakeX = g.shake > 0 ? (Math.random() - 0.5) * 2 * t.shakeIntensity * g.shake : 0;
  const shakeY = g.shake > 0 ? (Math.random() - 0.5) * 2 * t.shakeIntensity * g.shake : 0;

  return (
    <div className="root">
      <Stage refEl={stageRef}
             onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
        <div className="playfield" style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
          {/* background */}
          <div className="bg" style={bgStyle(t.theme, g.distancePx)} />
          <div className="runner" style={{ background: centerRunner(t.theme) }} />

          {/* objects */}
          {g.objects.map((o) => {
            const meta = OBJECT_META[o.kind];
            const sz = meta.base * o.scale;
            const tilt = meta.dyn ? clamp(o.vx / 12, -22, 22) : 0;
            return (
              <div key={o.id} className="obj" style={{ left: o.x, top: o.y, opacity: o.hit ? 0 : 1,
                    transform: `translate(-50%,-50%) rotate(${tilt}deg)`,
                    transition: o.hit ? 'opacity .2s' : 'none' }}>
                <ObjectSprite kind={o.kind} size={sz} />
              </div>
            );
          })}

          {/* baby */}
          <div className="baby" style={{ left: g.babyX, top: BABY_Y,
                opacity: blinking ? 0.35 : 1,
                transform: `translate(-50%,-58%) ${babyContactTransform(g, t)}` }}>
            <Baby phase={g.phase} crawlStyle={t.crawlStyle} bounce={t.bounceHeight}
                  skin={t.skin} cloth={t.cloth} mood={g.discomfort / 100}
                  hurt={!!g.contact && g.contact.type === 'hurt'}
                  play={!!g.contact && g.contact.type === 'play'} size={BABY_W} />
          </div>

          {/* prominent contact text near baby */}
          {g.contact && (
            <div className={`contact-burst ${g.contact.type}`}
                 style={{ left: g.babyX, top: BABY_Y - 70 }}>
              {g.contact.type === 'hurt' ? 'いたっ！' : 'わーい！'}
            </div>
          )}

          {/* popups */}
          {g.popups.map((p) => (
            <div key={p.id} className="popup" style={{ left: p.x, top: p.y - p.t * 46,
                  opacity: 1 - p.t / 1.1, color: p.color }}>{p.text}</div>
          ))}

          {/* HUD */}
          {screen === 'playing' && <Hud g={g} t={t} best={best.current} />}
        </div>

        {/* overlays */}
        {screen === 'title' && (
          <TitleScreen t={t} setTweak={setTweak} onStart={start} best={best.current} />
        )}
        {screen === 'over' && (
          <GameOverScreen t={t} result={lastResult.current} best={best.current}
                          onRetry={start} onTitle={toTitle} />
        )}
      </Stage>

      {/* Tweaks (host-toggled) */}
      <TweaksContent t={t} setTweak={setTweak} G={G} />
    </div>
  );
}

// transform applied to baby during contact animations (style variants)
function babyContactTransform(g, t) {
  if (!g.contact) return '';
  const k = g.contact.t / g.contact.dur;           // 0..1
  if (g.contact.type === 'hurt') {
    if (t.hurtStyle === 'tumble') return `rotate(${Math.sin(k * Math.PI * 3) * 22}deg)`;
    if (t.hurtStyle === 'squash') { const s = 1 - Math.sin(k * Math.PI) * 0.22; return `scale(${1 + (1 - s) * 0.4}, ${s})`; }
    return `translateX(${Math.sin(k * Math.PI * 6) * 6}px)`; // flash (default): tiny jitter, color handled in sprite
  }
  // play
  if (t.playStyle === 'spin') return `rotate(${k * 360}deg)`;
  if (t.playStyle === 'bounce') return `translateY(${-Math.abs(Math.sin(k * Math.PI * 3)) * 16}px)`;
  return `rotate(${Math.sin(k * Math.PI * 4) * 10}deg)`; // sit-wiggle (default)
}

// ── Stage: scales logical canvas to viewport, letterboxes ──
function Stage({ children, refEl, onPointerDown, onPointerMove, onPointerUp }) {
  const wrap = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const el = wrap.current; if (!el) return;
      const s = Math.min(el.clientWidth / W, el.clientHeight / H);
      setScale(s);
    };
    fit(); window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div className="stage-wrap" ref={wrap}>
      <div className="stage" ref={refEl}
           style={{ width: W, height: H, transform: `scale(${scale})` }}
           onPointerDown={onPointerDown} onPointerMove={onPointerMove}
           onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
        {children}
      </div>
    </div>
  );
}

// ── HUD ──
function Hud({ g, t, best }) {
  const stPct = clamp(g.stamina / g.maxStamina, 0, 1);
  const stColor = stPct > 0.5 ? '#ff6b81' : stPct > 0.25 ? '#ff9f43' : '#a4313f';
  const dcPct = g.discomfort / 100;
  const dcColor = mix('#9ad6c0', '#3a5a4a', dcPct);
  const dist = Math.floor(g.distancePx / PX_PER_M);
  return (
    <div className="hud">
      <div className="hud-top">
        <div className="gauges">
          <div className="gauge">
            <span className="g-ic">❤️</span>
            <div className="g-track"><div className="g-fill" style={{ width: `${stPct * 100}%`, background: stColor }} /></div>
          </div>
          <div className="gauge">
            <span className="g-ic">🧷</span>
            <div className="g-track"><div className="g-fill" style={{ width: `${dcPct * 100}%`, background: dcColor }} /></div>
            {g.discomfort >= 100 && <span className="g-warn">！パンパン！</span>}
          </div>
        </div>
        <div className="scores">
          <div className="sc-now">{dist}<span>m</span></div>
          <div className="sc-best">BEST {best.dist}m</div>
        </div>
      </div>
      <div className="hud-name">{t.name || 'あかちゃん'}</div>
    </div>
  );
}

// ── helpers ──
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function loadBest() { try { return JSON.parse(localStorage.getItem('baby_crawl_best')) || { dist: 0, score: 0 }; } catch { return { dist: 0, score: 0 }; } }
function saveBest(b) { try { localStorage.setItem('baby_crawl_best', JSON.stringify(b)); } catch {} }
function mix(a, b, x) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * x));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
