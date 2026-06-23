// screens.jsx — title / game over overlays, Tweaks panel content, spec export.

const { useState: useS, useRef: useR, useEffect: useE } = React;

// ── Title ──────────────────────────────────────────────────────────────────
function TitleScreen({ t, setTweak, onStart, best }) {
  const [phase, setPhase] = useS(0);
  useE(() => {
    let raf, last = performance.now();
    const loop = (now) => { setPhase((p) => (p + (now - last) / 1000 * 1.6) % 1); last = now; raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="overlay title">
      <div className="t-badge">Baby Crawl Run</div>
      <h1 className="t-title">はいはい！<br />ベビーラン</h1>
      <div className="t-baby"><Baby phase={phase} crawlStyle={t.crawlStyle} bounce={t.bounceHeight}
            skin={t.skin} cloth={t.cloth} size={132} /></div>
      <label className="t-namelbl">あかちゃんの なまえ</label>
      <input className="t-name" value={t.name} maxLength={8}
             onChange={(e) => { setTweak('name', e.target.value); try { localStorage.setItem('baby_crawl_name', e.target.value); } catch {} }}
             placeholder="なまえ" />
      <button className="t-start" onClick={onStart}>はじめる</button>
      <div className="t-hint">← → / A D で よけてね ・ ドラッグでも うごくよ</div>
      {best.dist > 0 && <div className="t-best">ベスト {best.dist}m</div>}
    </div>
  );
}

// ── Game over ────────────────────────────────────────────────────────────────
function GameOverScreen({ t, result, best, onRetry, onTitle }) {
  const [tm, setTm] = useS(0);
  useE(() => {
    let raf, last = performance.now();
    const loop = (now) => { setTm((v) => v + (now - last) / 1000); last = now; raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="overlay over">
      <div className="o-over">ゲームオーバー</div>
      <div className="o-title">すやすや… おやすみなさい</div>
      <div className="o-name">{t.name || 'あかちゃん'} は ねむっちゃった</div>
      <div className="o-baby">
        <svg width="240" height="172" viewBox="0 0 240 172" style={{ overflow: 'visible', position: 'absolute', inset: 0, zIndex: 2 }}>
          <Zzz t={tm} x={104} y={64} />
        </svg>
        <SleepingBaby skin={t.skin} cloth={t.cloth} size={236} t={tm} />
      </div>
      <div className="o-stats">
        <div className="o-stat"><span>こんかい</span><b>{result.dist}<i>m</i></b></div>
        <div className="o-stat best"><span>ベスト</span><b>{best.dist}<i>m</i></b></div>
      </div>
      <div className="o-btns">
        <button className="t-start" onClick={onRetry}>もういっかい</button>
        <button className="t-start ghost" onClick={onTitle}>タイトル</button>
      </div>
    </div>
  );
}

// ── Tweaks panel content (all spec numbers adjustable) ──────────────────────
const SKINS = ['#ffd9bf', '#f0bf9a', '#c89271'];
const CLOTHS = { ピンク: '#ffb3c7', ブルー: '#aaccf5', イエロー: '#ffe08a', ミント: '#a9e0c4' };

function applyPreset(setTweak, kind, v) {
  if (kind === 'speed') {
    const m = { slow: [130, 360], normal: [200, 440], fast: [280, 520] }[v];
    setTweak({ speedPreset: v, scrollSpeed: m[0], babyMoveSpeed: m[1] });
  } else {
    const m = { easy: [1.0, 30, 30, 40], normal: [0.75, 45, 30, 25], hard: [0.55, 55, 30, 15] }[v];
    setTweak({ diffPreset: v, spawnInterval: m[0], obstacleRate: m[1], toyRate: m[2], itemRate: m[3] });
  }
}

function TweaksContent({ t, setTweak, G }) {
  const [specOpen, setSpecOpen] = useS(false);
  return (
    <>
      <TweaksPanel title="Tweaks · 仕様確認">
        <TweakSection label="ゲーム速度" />
        <TweakRadio label="プリセット" value={t.speedPreset}
          options={[{ value: 'slow', label: 'ゆっくり' }, { value: 'normal', label: 'ふつう' }, { value: 'fast', label: 'はやい' }]}
          onChange={(v) => applyPreset(setTweak, 'speed', v)} />
        <TweakSlider label="スクロール速度" value={t.scrollSpeed} min={80} max={400} step={10} unit=" px/s" onChange={(v) => setTweak('scrollSpeed', v)} />
        <TweakSlider label="横移動速度" value={t.babyMoveSpeed} min={200} max={700} step={10} unit=" px/s" onChange={(v) => setTweak('babyMoveSpeed', v)} />

        <TweakSection label="難易度" />
        <TweakRadio label="プリセット" value={t.diffPreset}
          options={[{ value: 'easy', label: 'かんたん' }, { value: 'normal', label: 'ふつう' }, { value: 'hard', label: 'むずい' }]}
          onChange={(v) => applyPreset(setTweak, 'diff', v)} />
        <TweakSlider label="スポーン間隔" value={t.spawnInterval} min={0.3} max={1.4} step={0.05} unit=" s" onChange={(v) => setTweak('spawnInterval', v)} />
        <TweakSlider label="障害物率" value={t.obstacleRate} min={0} max={80} step={5} unit=" %" onChange={(v) => setTweak('obstacleRate', v)} />
        <TweakSlider label="おもちゃ率" value={t.toyRate} min={0} max={80} step={5} unit=" %" onChange={(v) => setTweak('toyRate', v)} />
        <TweakSlider label="回復アイテム率" value={t.itemRate} min={0} max={80} step={5} unit=" %" onChange={(v) => setTweak('itemRate', v)} />
        <TweakSlider label="哺乳瓶の割合" value={t.bottleShare} min={0} max={100} step={5} unit=" %" onChange={(v) => setTweak('bottleShare', v)} />

        <TweakSection label="パラメータ挙動" />
        <TweakSlider label="初期体力" value={t.staminaStart} min={50} max={150} step={5} onChange={(v) => setTweak('staminaStart', v)} />
        <TweakSlider label="体力消費／秒" value={t.drainPerSec} min={0} max={5} step={0.5} unit=" /s" onChange={(v) => setTweak('drainPerSec', v)} />
        <TweakSlider label="障害物ダメージ" value={t.obstacleDamage} min={0} max={30} step={1} onChange={(v) => setTweak('obstacleDamage', v)} />
        <TweakSlider label="おもちゃダメージ" value={t.toyDamage} min={0} max={30} step={1} onChange={(v) => setTweak('toyDamage', v)} />
        <TweakSlider label="哺乳瓶回復" value={t.bottleHealPct} min={0} max={50} step={5} unit=" %" onChange={(v) => setTweak('bottleHealPct', v)} />
        <TweakSlider label="不快度しきい値" value={t.discomfortThreshold} min={50} max={100} step={5} unit=" %" onChange={(v) => setTweak('discomfortThreshold', v)} />
        <TweakSlider label="消費倍率" value={t.drainMultiplier} min={1} max={4} step={0.5} unit=" x" onChange={(v) => setTweak('drainMultiplier', v)} />
        <TweakSlider label="無敵時間" value={t.invincibleTime} min={0} max={2.5} step={0.1} unit=" s" onChange={(v) => setTweak('invincibleTime', v)} />
        <TweakSlider label="接触フリーズ時間" value={t.contactTime} min={0.2} max={1.5} step={0.1} unit=" s" onChange={(v) => setTweak('contactTime', v)} />

        <TweakSection label="アニメーション（案）" />
        <TweakRadio label="ハイハイ" value={t.crawlStyle}
          options={[{ value: 'diagonal', label: 'A対角' }, { value: 'bunny', label: 'Bうさぎ' }, { value: 'wiggle', label: 'Cくねくね' }]}
          onChange={(v) => setTweak('crawlStyle', v)} />
        <TweakRadio label="被弾演出" value={t.hurtStyle}
          options={[{ value: 'flash', label: 'A点滅' }, { value: 'tumble', label: 'B回転' }, { value: 'squash', label: 'C潰れ' }]}
          onChange={(v) => setTweak('hurtStyle', v)} />
        <TweakRadio label="遊ぶ演出" value={t.playStyle}
          options={[{ value: 'sit', label: 'A揺れ' }, { value: 'bounce', label: 'B跳ね' }, { value: 'spin', label: 'C回転' }]}
          onChange={(v) => setTweak('playStyle', v)} />
        <TweakSlider label="ハイハイ速さ" value={t.crawlCyclesPerSec} min={0.5} max={5} step={0.1} unit=" /s" onChange={(v) => setTweak('crawlCyclesPerSec', v)} />
        <TweakSlider label="上下バウンド" value={t.bounceHeight} min={0} max={20} step={1} unit=" px" onChange={(v) => setTweak('bounceHeight', v)} />
        <TweakSlider label="シェイク強さ" value={t.shakeIntensity} min={0} max={20} step={1} unit=" px" onChange={(v) => setTweak('shakeIntensity', v)} />
        <TweakSlider label="シェイク時間" value={t.shakeDuration} min={0.1} max={0.8} step={0.05} unit=" s" onChange={(v) => setTweak('shakeDuration', v)} />

        <TweakSection label="赤ちゃん" />
        <TweakText label="名前" value={t.name} placeholder="なまえ" onChange={(v) => setTweak('name', v)} />
        <TweakColor label="肌の色" value={t.skin} options={SKINS} onChange={(v) => setTweak('skin', v)} />
        <TweakColor label="服の色" value={t.cloth} options={Object.values(CLOTHS)} onChange={(v) => setTweak('cloth', v)} />

        <TweakSection label="ばしょ" />
        <TweakRadio label="背景" value={t.theme}
          options={[{ value: 'room', label: 'おへや' }, { value: 'park', label: 'こうえん' }, { value: 'night', label: 'よる' }]}
          onChange={(v) => setTweak('theme', v)} />

        <TweakSection label="サウンド" />
        <TweakToggle label="効果音" value={t.sfxOn} onChange={(v) => setTweak('sfxOn', v)} />
        <TweakToggle label="子守唄BGM" value={t.bgmOn} onChange={(v) => setTweak('bgmOn', v)} />

        <TweakSection label="仕様書" />
        <TweakButton label="📋 仕様書を出力" onClick={() => setSpecOpen(true)} />
      </TweaksPanel>
      {specOpen && <SpecModal t={t} onClose={() => setSpecOpen(false)} />}
    </>
  );
}

// ── Spec export modal: builds Markdown from current tweak values ─────────────
function buildSpec(t) {
  const clothName = Object.entries(CLOTHS).find(([, v]) => v === t.cloth)?.[0] || t.cloth;
  return `# はいはい！ベビーラン — 確定仕様（${new Date().toLocaleDateString('ja-JP')}）

> プロトタイプの Tweaks で確定した数値。Claude Code 実装用。

## スピード
- スクロール速度: **${t.scrollSpeed} px/s**
- 赤ちゃん横移動速度: **${t.babyMoveSpeed} px/s**
- (px→m 換算: ${PX_PER_M} px = 1 m)

## 難易度（スポーン）
- スポーン間隔: **${t.spawnInterval} s**
- 出現比率 — 障害物 **${t.obstacleRate}%** / おもちゃ **${t.toyRate}%** / 回復アイテム **${t.itemRate}%**
- 回復アイテム内訳 — 哺乳瓶 **${t.bottleShare}%** / オムツ **${100 - t.bottleShare}%**
- 配置: 5レーンにランダム。サイズは種類ごとに統一（大: 椅子・テディベア / 中: ボール・哺乳瓶・オムツ / 小: アヒル）。動的(ボール)は **斜め方向**に移動し側壁で反射、静的は背景と同速。
- オブジェクト構成 — 障害物: **椅子(静的)** / おもちゃ: **ボール(動的)・テディベア(静的)・アヒル(静的)** / 回復: **哺乳瓶・オムツ**

## パラメータ挙動
- 初期体力 / 最大体力: **${t.staminaStart}**
- 体力消費: 時間経過で **${t.drainPerSec}/秒**（不快度 ${t.discomfortThreshold}% 以上で **×${t.drainMultiplier}**）
- 障害物ダメージ: **-${t.obstacleDamage}** / おもちゃダメージ: **-${t.toyDamage}**
- 哺乳瓶回復: 最大体力の **${t.bottleHealPct}%**（上限まで）
- オムツ: 不快度を **0%** に全回復
- 不快度: 体力消費の **2倍** の速さ（**${(t.drainPerSec * 2).toFixed(1)}/秒**）で自動上昇、100%で「！パンパン！」表示
- 無敵時間: 衝突後 **${t.invincibleTime}s**（点滅）
- 接触フリーズ: **${t.contactTime}s** 間スコア・距離の加算を停止
- 体力 0 でゲームオーバー

## アニメーション
- ハイハイ: **${{ diagonal: 'A 対角（自然なハイハイ・左腕と右脚が交互）', bunny: 'B うさぎ跳ね（両腕→両脚）', wiggle: 'C くねくね（左右に体を振る）' }[t.crawlStyle]}**
  - サイクル: **${t.crawlCyclesPerSec}/s**（スクロール速度に比例）、上下バウンド **${t.bounceHeight}px**
- 被弾演出: **${{ flash: 'A 点滅＋赤グロー＋色相シフト＋小刻みジッター', tumble: 'B 回転（左右に転ぶ）', squash: 'C 潰れ（縦に押し潰れる）' }[t.hurtStyle]}**
- 遊ぶ演出: **${{ sit: 'A 揺れ（座って左右に揺れる）', bounce: 'B 跳ね（その場で跳ねる）', spin: 'C 回転（一回転）' }[t.playStyle]}**
- 画面シェイク（被弾時）: 強さ **${t.shakeIntensity}px** / 減衰 **${t.shakeDuration}s**
- 不快度80%以上: 困り顔＋汗の表情に切替
- 接触テキスト: 障害物=「いたっ！」/ おもちゃ=「わーい！」を赤ちゃん頭上に大きくポップ表示（スケールイン）
- ポップテキスト: 「+体力」(緑) /「おむつ交換！」(青) /「いたっ！」(赤) /「遊んじゃった！」(橙) を上方向フェードで表示

## 見た目
- 肌の色: \`${t.skin}\` / 服の色: \`${t.cloth}\`（${clothName}）
- 背景テーマ: **${{ room: 'おへや（木目＋中央ラグ）', park: 'こうえん（草地＋花＋小道）', night: 'よる（紺グラデ＋星＋光カーペット）' }[t.theme]}**

## サウンド
- 効果音: ${t.sfxOn ? 'ON' : 'OFF'} / 子守唄BGM(C major ~70BPM): ${t.bgmOn ? 'ON' : 'OFF'}
`;
}

function SpecModal({ t, onClose }) {
  const [copied, setCopied] = useS(false);
  const md = buildSpec(t);
  const copy = async () => { try { await navigator.clipboard.writeText(md); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {} };
  return (
    <div className="spec-back" onClick={onClose}>
      <div className="spec-modal" onClick={(e) => e.stopPropagation()}>
        <div className="spec-hd">
          <b>確定仕様（Markdown）</b>
          <div className="spec-actions">
            <button className="spec-copy" onClick={copy}>{copied ? '✓ コピー済' : '📋 コピー'}</button>
            <button className="spec-x" onClick={onClose}>✕</button>
          </div>
        </div>
        <textarea className="spec-text" readOnly value={md} />
        <div className="spec-foot">この内容を Claude Code に渡すとプロトタイプ通りに実装できます。</div>
      </div>
    </div>
  );
}

Object.assign(window, { TitleScreen, GameOverScreen, TweaksContent, SpecModal, buildSpec });
