// sprites.jsx — all SVG characters / items / obstacles / backgrounds.
// Hand-drawn picture-book style. No external images.
// Baby supports 3 crawl-animation variants (A diagonal / B bunny-hop / C wiggle),
// hurt + play poses. Crawling shows the BACK of the head (baby moves away from camera).
// SleepingBaby = side-lying / cheek-squished pose on a futon, for game over.

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
function rot([x, y], deg) { const r = deg * DEG, c = Math.cos(r), s = Math.sin(r); return [x * c - y * s, x * s + y * c]; }

// ── Baby ─────────────────────────────────────────────────────────────────────
// Top-down crawling baby. Limbs are 2-point capsules (shoulder/hip → hand/foot);
// the far end sweeps fore-aft by rotating its base vector → reads as crawling.
function Baby({
  phase = 0, crawlStyle = 'diagonal', bounce = 7,
  skin = '#ffd9bf', cloth = '#ffb3c7', mood = 0, hurt = false, play = false,
  size = 120,
}) {
  const a = (phase % 1) * TAU;
  const id = React.useId().replace(/:/g, '');
  const skinShade = shade(skin, -0.10);
  const clothShade = shade(cloth, -0.12);
  const worried = mood >= 0.8;

  // Top-down "on all fours": head leads (top), hands planted AHEAD of head,
  // knees tuck under, feet kick out behind (bottom). Diagonal alternation.
  const shL = [-13, -16], shR = [13, -16];        // shoulders
  const hpL = [-12, 14], hpR = [12, 14];          // hips
  const handBaseL = [-25, -50], handBaseR = [25, -50]; // hands planted ahead, flanking head
  const footBaseL = [-20, 42], footBaseR = [20, 42];   // feet kicking back

  // reach: +1 = limb forward/planted (toward top), -1 = lifted/pulled back
  let rAL, rAR, rLL, rLR, bob = 0, sway = 0, tilt = 0;
  if (crawlStyle === 'bunny') {
    const hop = Math.max(0, Math.sin(a));
    rAL = rAR = Math.sin(a);
    rLL = rLR = Math.sin(a + Math.PI);
    bob = -(hop ** 1.4) * (bounce * 2.0);
  } else if (crawlStyle === 'wiggle') {
    rAL = Math.sin(a) * 0.8; rAR = Math.sin(a + Math.PI) * 0.8;
    rLL = Math.sin(a + Math.PI) * 0.8; rLR = Math.sin(a) * 0.8;
    sway = Math.sin(a) * 8; tilt = Math.sin(a) * 5;
    bob = -Math.abs(Math.sin(a * 2)) * bounce * 0.5;
  } else { // diagonal — L hand + R knee lead together
    rAL = Math.sin(a); rAR = Math.sin(a + Math.PI);
    rLL = Math.sin(a + Math.PI); rLR = Math.sin(a);
    bob = -Math.abs(Math.sin(a * 2)) * bounce;
  }

  // hand reaches further up (forward) & inward when planted; drops back when lifted
  const REACH = 8;
  let handL = [handBaseL[0] - rAL * 3, handBaseL[1] - rAL * REACH];
  let handR = [handBaseR[0] + rAR * 3, handBaseR[1] - rAR * REACH];
  // knee tucks forward (foot lifts toward body) when leading, kicks out when trailing
  let footL = [footBaseL[0] - rLL * 3, footBaseL[1] - rLL * REACH];
  let footR = [footBaseR[0] + rLR * 3, footBaseR[1] - rLR * REACH];

  // play pose: sit back, both hands up clapping
  if (play) {
    handL = [-20, -52 + Math.sin(a * 3) * 8]; handR = [20, -52 - Math.sin(a * 3) * 8];
    footL = [-22, 38]; footR = [22, 38]; bob = -3 + Math.sin(a * 4) * 3; sway = 0; tilt = 0;
  }
  const headBob = bob * 0.4;

  return (
    <svg width={size} height={size * 1.18} viewBox="0 0 120 142"
         style={{ overflow: 'visible', display: 'block',
                  filter: hurt ? 'drop-shadow(0 0 10px rgba(255,70,70,.95)) hue-rotate(-20deg) saturate(1.5)' : 'none' }}>
      <defs>
        <radialGradient id={`ck${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9bb0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff9bb0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={`translate(${60 + sway} ${76 + bob}) rotate(${tilt})`}>
        <ellipse cx="0" cy="46" rx="33" ry="8.5" fill="rgba(0,0,0,0.10)" />

        {/* ── back legs (behind body) ── */}
        <Capsule a={hpL} b={footL} w={14} color={clothShade} cap={skin} sock={cloth} foot />
        <Capsule a={hpR} b={footR} w={14} color={clothShade} cap={skin} sock={cloth} foot />

        {/* ── onesie body ── */}
        <path d="M-25 4 Q-29 -20 0 -22 Q29 -20 25 4 Q27 30 0 33 Q-27 30 -25 4 Z"
              fill={cloth} stroke={clothShade} strokeWidth="1.5" />
        <path d="M-15 27 Q0 37 15 27 L13 34 Q0 40 -13 34 Z" fill="#fffdf8" stroke="#e9e2d4" strokeWidth="1" />
        <path d="M0 -14 L0 19" stroke={clothShade} strokeWidth="1.2" opacity="0.45" />
        <circle cx="0" cy="-1" r="1.6" fill={clothShade} opacity="0.6" />

        {/* ── front arms ── */}
        <Capsule a={shL} b={handL} w={12} color={cloth} cap={skin} hand />
        <Capsule a={shR} b={handR} w={12} color={cloth} cap={skin} hand />

        {/* ── back of head (baby crawls away from the camera) ── */}
        <g transform={`translate(0 ${-40 + headBob})`}>
          {/* skull */}
          <path d="M-23 4 Q-23 -28 0 -30 Q23 -28 23 4 Q23 24 0 26 Q-23 24 -23 4 Z"
                fill={skin} stroke={skinShade} strokeWidth="1.5" />
          {/* ears peeking out at the sides */}
          <circle cx="-23" cy="3" r="5" fill={skin} stroke={skinShade} strokeWidth="1.2" />
          <circle cx="23" cy="3" r="5" fill={skin} stroke={skinShade} strokeWidth="1.2" />
          {/* hair cap over the crown, soft wispy nape at the bottom */}
          <path d="M-22 8 Q-24 -27 0 -30 Q24 -27 22 8 Q17 14 12 9 Q6 15 0 10 Q-6 15 -12 9 Q-17 14 -22 8 Z"
                fill={shade(skin, -0.40)} stroke={shade(skin, -0.50)} strokeWidth="1.2" strokeLinejoin="round" />
          {/* cowlick swirl at the crown */}
          <path d="M2 -7 q8 -1 8 -9 q0 -8 -8 -8 q-7 0 -7 7"
                fill="none" stroke={shade(skin, -0.52)} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          {/* a couple of wispy strands */}
          <path d="M-9 1 q-3 5 -1 9 M9 1 q3 5 1 9" fill="none" stroke={shade(skin, -0.50)} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
        </g>
      </g>
    </svg>
  );
}
function add([x, y], [u, v]) { return [x + u, y + v]; }

// capsule limb: thick round line a→b, with hand circle or sock+foot at b
function Capsule({ a, b, w, color, cap, hand, foot, sock }) {
  return (
    <g>
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={w} strokeLinecap="round" />
      {hand && <circle cx={b[0]} cy={b[1]} r={w / 2 + 1.5} fill={cap} />}
      {foot && (
        <>
          <circle cx={b[0]} cy={b[1]} r={w / 2 + 1} fill={sock} />
          <ellipse cx={b[0]} cy={b[1] + 1} rx={w / 2} ry={w / 2 - 1.5} fill={cap} />
        </>
      )}
    </g>
  );
}

// ── Sleeping baby (game over) — side-lying on a futon, cheek squished, cozy ─────
function SleepingBaby({ skin = '#ffd9bf', cloth = '#ffb3c7', size = 230, t = 0 }) {
  const breathe = Math.sin(t * 1.6) * 0.9;        // gentle vertical breathing
  const sh = shade(skin, -0.12), cs = shade(cloth, -0.12);
  const hair = shade(skin, -0.42), hairD = shade(skin, -0.52);
  const cheek = shade(skin, -0.04);
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 240 172" style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <radialGradient id="sleepck" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9bb0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff9bb0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="122" cy="152" rx="106" ry="16" fill="rgba(0,0,0,0.08)" />

      {/* ── futon ── */}
      <rect x="16" y="80" width="208" height="70" rx="26" fill="#fdfaf3" stroke="#ece1cd" strokeWidth="2.5" />
      <path d="M70 86 L70 144 M124 86 L124 144 M178 86 L178 144" stroke="#efe6d4" strokeWidth="2" opacity="0.85" />
      {/* pillow under the head */}
      <ellipse cx="78" cy="104" rx="48" ry="31" fill="#ffffff" stroke="#ece1cd" strokeWidth="2.5" />
      <ellipse cx="78" cy="105" rx="35" ry="20" fill="#fbf4e6" opacity="0.7" />

      {/* ── baby, lying on its side / slightly prone ── */}
      <g transform={`translate(0 ${breathe})`}>
        {/* tucked legs (behind) */}
        <path d="M150 118 q36 -4 42 16 q-2 13 -22 9 q5 -15 -20 -11 Z" fill={cloth} stroke={cs} strokeWidth="2.2" strokeLinejoin="round" />
        {/* back arm tucked under */}
        <path d="M118 122 q-12 14 4 24" fill="none" stroke={skin} strokeWidth="13" strokeLinecap="round" />

        {/* curled body / onesie */}
        <path d="M104 94 Q150 82 166 110 Q176 134 150 144 Q116 152 96 132 Q84 110 104 94 Z"
              fill={cloth} stroke={cs} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M118 102 Q146 98 158 120" fill="none" stroke={cs} strokeWidth="1.6" opacity="0.5" />

        {/* head resting on pillow, tilted; lower cheek squished against the futon */}
        <g transform="translate(78 100) rotate(-13)">
          {/* head — flattened on the lower-left where the cheek presses down */}
          <path d="M-30 -6 Q-32 -34 0 -36 Q32 -34 30 -4 Q30 14 14 22 Q-4 30 -22 22 Q-37 13 -30 -6 Z"
                fill={skin} stroke={sh} strokeWidth="2" strokeLinejoin="round" />
          {/* squished-cheek bulge pooling onto the pillow */}
          <path d="M-24 12 Q-16 30 8 25 Q0 21 -4 12 Z" fill={cheek} opacity="0.55" />
          {/* ear */}
          <circle cx="27" cy="5" r="6" fill={skin} stroke={sh} strokeWidth="1.4" />
          {/* hair over the crown + cowlick */}
          <path d="M-28 -8 Q-30 -34 0 -36 Q30 -34 28 -6 Q15 -1 0 -3 Q-14 -1 -28 -8 Z"
                fill={hair} stroke={hairD} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M4 -16 q9 -1 9 -9" fill="none" stroke={hairD} strokeWidth="2" strokeLinecap="round" opacity="0.75" />
          {/* peaceful closed eyes */}
          <path d="M-17 3 Q-11 -3 -5 3" fill="none" stroke="#4a3526" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M3 5 Q9 -1 15 5" fill="none" stroke="#4a3526" strokeWidth="2.4" strokeLinecap="round" />
          {/* rosy cheeks — bottom one fat & squished */}
          <ellipse cx="-9" cy="15" rx="12" ry="9" fill="url(#sleepck)" />
          <ellipse cx="15" cy="13" rx="6" ry="5" fill="url(#sleepck)" />
          {/* tiny content mouth */}
          <path d="M-5 17 Q0 21 6 17" fill="none" stroke="#c4607a" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* both hands gathered up near the face */}
        <path d="M58 116 q-8 -16 6 -26" fill="none" stroke={skin} strokeWidth="13" strokeLinecap="round" />
        <circle cx="64" cy="90" r="9" fill={skin} stroke={sh} strokeWidth="1.4" />
        <circle cx="60" cy="116" r="9" fill={skin} stroke={sh} strokeWidth="1.4" />

        {/* blanket draped over the lower half */}
        <path d="M110 130 Q150 118 198 132 Q204 156 150 162 Q102 160 98 140 Q100 132 110 130 Z"
              fill={shade(cloth, 0.14)} stroke={cs} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M108 137 Q150 127 194 139" fill="none" stroke={cs} strokeWidth="1.6" opacity="0.5" />
      </g>
    </svg>
  );
}

// floating ZZZ — rise + grow + fade, staggered (caller animates `t`)
function Zzz({ t = 0, x = 0, y = 0 }) {
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const local = ((t * 0.45 + i * 0.34) % 1);
        const op = Math.sin(local * Math.PI);
        const yy = y - local * 56;
        const xx = x + i * 15 + Math.sin(local * 6 + i) * 4;
        const sz = 14 + i * 6 + local * 4;
        return (
          <text key={i} x={xx} y={yy} fontSize={sz} fill="#8b9bd4" opacity={op}
                fontWeight="800" fontFamily="'Baloo 2', sans-serif"
                transform={`rotate(${12 + i * 5} ${xx} ${yy})`}>Z</text>
        );
      })}
    </g>
  );
}

// ── Items / obstacles / toys (improved quality) ───────────────────────────────
function Bottle({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 56" style={spr}>
      <ellipse cx="26" cy="52" rx="14" ry="4" fill="rgba(0,0,0,0.1)" />
      <rect x="13" y="18" width="26" height="32" rx="12" fill="#eaf6ff" stroke="#9cc6e8" strokeWidth="2.2" />
      <path d="M16 40 Q16 47 24 48 L28 48 Q36 47 36 40 Z" fill="#bfe0ff" />
      <rect x="17" y="10" width="18" height="10" rx="5" fill="#ffd56b" stroke="#e0ab33" strokeWidth="1.8" />
      <path d="M21 10 Q26 1 31 10" fill="#ffe39a" stroke="#e0ab33" strokeWidth="1.8" />
      <g stroke="#9cc6e8" strokeWidth="1.5" strokeLinecap="round">
        <line x1="20" y1="26" x2="32" y2="26" /><line x1="20" y1="30" x2="32" y2="30" /><line x1="20" y1="34" x2="32" y2="34" />
      </g>
      <ellipse cx="20" cy="24" rx="2.5" ry="5" fill="#fff" opacity="0.7" />
    </svg>
  );
}
function Diaper({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" style={spr}>
      <ellipse cx="26" cy="46" rx="16" ry="4" fill="rgba(0,0,0,0.1)" />
      <path d="M9 17 Q26 11 43 17 Q43 36 26 43 Q9 36 9 17 Z" fill="#fffdf8" stroke="#cfdce8" strokeWidth="2.2" />
      <path d="M9 17 Q26 26 43 17 L43 23 Q26 32 9 23 Z" fill="#cfe9ff" />
      <rect x="6" y="14" width="7" height="11" rx="3.5" fill="#eaf2f8" stroke="#cfdce8" strokeWidth="1.6" />
      <rect x="39" y="14" width="7" height="11" rx="3.5" fill="#eaf2f8" stroke="#cfdce8" strokeWidth="1.6" />
      <circle cx="18" cy="31" r="2.3" fill="#ffc2d6" /><circle cx="26" cy="34" r="2.3" fill="#bfe6c9" /><circle cx="34" cy="31" r="2.3" fill="#ffe39a" />
    </svg>
  );
}
// Chair — little wooden kid's chair (obstacle, static).
function Chair({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 58" style={spr}>
      <ellipse cx="26" cy="53" rx="18" ry="4" fill="rgba(0,0,0,0.12)" />
      {/* back legs */}
      <line x1="20" y1="31" x2="17" y2="50" stroke="#b5783f" strokeWidth="3.6" strokeLinecap="round" />
      <line x1="34" y1="31" x2="37" y2="50" stroke="#b5783f" strokeWidth="3.6" strokeLinecap="round" />
      {/* backrest */}
      <rect x="14" y="7" width="24" height="21" rx="5" fill="#f0b56e" stroke="#b5783f" strokeWidth="2" />
      <rect x="19" y="12" width="14" height="12" rx="3" fill="#e2a45c" />
      <ellipse cx="22" cy="12" rx="3" ry="2" fill="#fff" opacity="0.4" />
      {/* seat */}
      <rect x="12" y="26" width="28" height="9" rx="3.5" fill="#e2a45c" stroke="#b5783f" strokeWidth="2" />
      {/* front legs */}
      <line x1="16" y1="34" x2="15" y2="51" stroke="#cf9152" strokeWidth="4" strokeLinecap="round" />
      <line x1="36" y1="34" x2="37" y2="51" stroke="#cf9152" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
function Ball({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" style={spr}>
      <ellipse cx="26" cy="48" rx="15" ry="4" fill="rgba(0,0,0,0.12)" />
      <circle cx="26" cy="27" r="19" fill="#ff8da3" stroke="#e36b85" strokeWidth="2.2" />
      <path d="M7 27 Q26 18 45 27" fill="none" stroke="#fff" strokeWidth="2.6" opacity="0.9" />
      <path d="M26 8 Q34 27 26 46" fill="none" stroke="#fff" strokeWidth="2.6" opacity="0.9" />
      <path d="M11 16 Q20 22 18 35" fill="none" stroke="#ffd1db" strokeWidth="2" opacity="0.8" />
      <ellipse cx="19" cy="19" rx="4.5" ry="3.5" fill="#fff" opacity="0.6" />
    </svg>
  );
}
function Teddy({ size = 56 }) {
  const f = '#c79a6b', d = '#a87f52', l = '#ecd6b8';
  return (
    <svg width={size} height={size} viewBox="0 0 60 62" style={spr}>
      <ellipse cx="30" cy="57" rx="21" ry="4" fill="rgba(0,0,0,0.12)" />
      {/* legs */}
      <ellipse cx="20" cy="49" rx="10" ry="9" fill={f} stroke={d} strokeWidth="2" />
      <ellipse cx="40" cy="49" rx="10" ry="9" fill={f} stroke={d} strokeWidth="2" />
      <ellipse cx="20" cy="50" rx="4.5" ry="4" fill={l} />
      <ellipse cx="40" cy="50" rx="4.5" ry="4" fill={l} />
      {/* arms */}
      <ellipse cx="11" cy="35" rx="7.5" ry="9" fill={f} stroke={d} strokeWidth="2" transform="rotate(-18 11 35)" />
      <ellipse cx="49" cy="35" rx="7.5" ry="9" fill={f} stroke={d} strokeWidth="2" transform="rotate(18 49 35)" />
      {/* belly */}
      <ellipse cx="30" cy="39" rx="15" ry="14" fill={f} stroke={d} strokeWidth="2.2" />
      <ellipse cx="30" cy="41" rx="9" ry="9" fill={l} />
      {/* ears */}
      <circle cx="18" cy="11" r="7" fill={f} stroke={d} strokeWidth="2" />
      <circle cx="42" cy="11" r="7" fill={f} stroke={d} strokeWidth="2" />
      <circle cx="18" cy="11" r="3.2" fill={l} />
      <circle cx="42" cy="11" r="3.2" fill={l} />
      {/* head */}
      <circle cx="30" cy="18" r="13" fill={f} stroke={d} strokeWidth="2.2" />
      {/* muzzle */}
      <ellipse cx="30" cy="22" rx="7" ry="5.5" fill={l} />
      <ellipse cx="30" cy="19.5" rx="2.6" ry="2" fill="#5a4232" />
      <path d="M30 21.5 v3" stroke="#5a4232" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M30 24.5 q-3 2 -5 0 M30 24.5 q3 2 5 0" fill="none" stroke="#5a4232" strokeWidth="1.2" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="24.5" cy="15" r="2.1" fill="#4a3526" />
      <circle cx="35.5" cy="15" r="2.1" fill="#4a3526" />
      <circle cx="25.2" cy="14.3" r="0.7" fill="#fff" />
      <circle cx="36.2" cy="14.3" r="0.7" fill="#fff" />
    </svg>
  );
}
// Duck — classic yellow bath rubber duck (side profile, floating).
function Duck({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 50" style={spr}>
      <ellipse cx="28" cy="46" rx="18" ry="3.5" fill="rgba(0,0,0,0.12)" />
      {/* body — chunky, flat-bottomed float */}
      <path d="M8 36 Q6 21 23 21 Q41 21 45 34 Q47 41 38 42 L15 42 Q8 42 8 36 Z" fill="#ffd23f" stroke="#e7a81f" strokeWidth="2.2" strokeLinejoin="round" />
      {/* tail */}
      <path d="M9 30 q-8 -4 -8 4 q5 4 10 0 Z" fill="#ffd23f" stroke="#e7a81f" strokeWidth="2" strokeLinejoin="round" />
      {/* head */}
      <circle cx="37" cy="15" r="11" fill="#ffdc54" stroke="#e7a81f" strokeWidth="2.2" />
      {/* hair tuft */}
      <path d="M37 4 q3 -3 5 1 q-2 2 -5 1 Z" fill="#ffc52e" stroke="#e7a81f" strokeWidth="1.2" />
      {/* beak */}
      <path d="M46 14 q11 -1 10 4 q-2 4 -10 2 Z" fill="#ff8a1e" stroke="#e06f12" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M47 18 q4 1 8 0" stroke="#e06f12" strokeWidth="1.2" fill="none" />
      {/* eye */}
      <circle cx="36" cy="12" r="2.4" fill="#3a2a1c" />
      <circle cx="36.9" cy="11.2" r="0.8" fill="#fff" />
      {/* wing */}
      <path d="M20 31 q9 -6 17 -1 q-7 7 -17 4 Z" fill="#ffcb2e" stroke="#e7a81f" strokeWidth="1.6" />
      {/* water ripple */}
      <path d="M5 42 q6 4 14 0 q8 4 16 0 q8 4 14 0" fill="none" stroke="#bfe6ff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}
const spr = { display: 'block', overflow: 'visible' };

function ObjectSprite({ kind, size }) {
  switch (kind) {
    case 'bottle': return <Bottle size={size} />;
    case 'diaper': return <Diaper size={size} />;
    case 'chair': return <Chair size={size} />;
    case 'ball': return <Ball size={size} />;
    case 'teddy': return <Teddy size={size} />;
    case 'duck': return <Duck size={size} />;
    default: return null;
  }
}

// dyn = moves toward baby (diagonally); base = sprite size (px), grouped by size class:
//   大 = 椅子 / テディベア · 中 = ボール / 哺乳瓶 / オムツ · 小 = アヒル
const OBJECT_META = {
  bottle: { label: '哺乳瓶', cat: 'item', dyn: false, base: 54 },
  diaper: { label: 'オムツ', cat: 'item', dyn: false, base: 54 },
  chair: { label: '椅子', cat: 'obstacle', dyn: false, base: 76 },
  ball: { label: 'ボール', cat: 'toy', dyn: true, base: 54 },
  teddy: { label: 'テディベア', cat: 'toy', dyn: false, base: 76 },
  duck: { label: 'アヒルのおもちゃ', cat: 'toy', dyn: false, base: 42 },
};

// ── Backgrounds ────────────────────────────────────────────────────────────
function bgStyle(theme, scroll) {
  if (theme === 'park') {
    const y = `${scroll % 240}px`;
    return {
      background:
        `radial-gradient(circle at 22% 12%, #ffffff66 2px, transparent 3px) 0 ${y}/64px 84px,
         radial-gradient(circle at 68% 52%, #ffd9ec88 3px, transparent 4px) 0 ${y}/92px 122px,
         radial-gradient(circle at 88% 80%, #fff6b088 2.5px, transparent 4px) 0 ${y}/120px 150px,
         linear-gradient(#bfe3a0, #a6d585)`,
    };
  }
  if (theme === 'night') {
    return {
      background:
        `radial-gradient(circle at 30% 20%, #fff 1px, transparent 2px) 0 ${scroll % 160}px/70px 90px,
         radial-gradient(circle at 80% 60%, #fdf6c9 1.5px, transparent 2.5px) 0 ${scroll % 200}px/110px 130px,
         radial-gradient(circle at 55% 90%, #cdd6ff 1.5px, transparent 2.5px) 0 ${scroll % 240}px/150px 170px,
         linear-gradient(#2c3168, #191d45)`,
    };
  }
  // ── room — warm honey wood floor, planks running away, end-seams scroll ──
  const y = `${scroll % 150}px`;
  return {
    background:
      `repeating-linear-gradient(0deg, rgba(90,55,20,.16) 0 2px, transparent 2px 150px) 0 ${y}/100% 150px,
       repeating-linear-gradient(0deg, rgba(255,240,210,.10) 0 1px, transparent 1px 9px) 0 ${y}/100% 150px,
       repeating-linear-gradient(90deg, rgba(120,80,40,.20) 0 2px, transparent 2px 60px) 0 0/60px 100%,
       repeating-linear-gradient(90deg, #d8a667 0 60px, #cf9b58 60px 120px) 0 0/120px 100%`,
  };
}
function centerRunner(theme) {
  if (theme === 'park') return 'repeating-linear-gradient(0deg, #ece0c6 0 22px, #e4d6b6 22px 44px)';
  if (theme === 'night') return 'linear-gradient(rgba(255,247,200,.34), rgba(255,247,200,.16))';
  // soft woven rug with a stripe
  return `linear-gradient(90deg, transparent 0 6%, #e7b9c9 6% 9%, #f3e3cf 9% 91%, #e7b9c9 91% 94%, transparent 94%)`;
}

function shade(hex, amt) {
  const h = hex.replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const r = parseInt(x.slice(0, 2), 16), g = parseInt(x.slice(2, 4), 16), b = parseInt(x.slice(4, 6), 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + 255 * amt)));
  return `#${[f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

Object.assign(window, {
  Baby, SleepingBaby, Zzz, ObjectSprite, OBJECT_META,
  bgStyle, centerRunner, shade, Bottle, Diaper, Chair, Ball, Teddy, Duck,
});
