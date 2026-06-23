# 引き継ぎ資料：はいはい！ベビーラン（Baby Crawl Run）

縦スクロール型の無限ランナーゲーム。プレイヤーは床をハイハイで進む赤ちゃんを左右に操作し、障害物を避けながら、おもちゃで遊んだり哺乳瓶・オムツで体力／不快度を管理して、どこまで進めたか（m＝メートル）を競う、ゆるい癒し系ゲーム。

---

## このバンドルの位置づけ（最初に読んでください）

- `reference/` 内のファイルは **HTML/React(Babel) で作った「動く設計リファレンス（プロトタイプ）」** です。完成版の見た目と挙動を確認するためのもので、**そのまま本番コードとして移植する前提のものではありません**。
- あなた（Claude Code）のタスクは、**このプロトタイプの見た目・挙動を、ターゲットのコードベースの環境・流儀で作り直すこと**です。
  - 既存のコードベース（React / Vue / SwiftUI / Unity / ネイティブ等）があるなら、その確立されたパターン・ライブラリに沿って実装してください。
  - 環境がまだ無いなら、このゲームに最適なフレームワークを選んで実装してください（後述「実装の推奨」参照）。
- ビジュアルは全て **手描き風 SVG（外部画像なし）**、サウンドは **Web Audio による合成音（外部音声ファイルなし）** です。同等の表現を再現できる範囲で、ターゲット環境のネイティブな描画／音声手段に置き換えて構いません。

## 完成度（Fidelity）

**ハイファイ（hifi）**。色・タイポグラフィ・余白・アニメーション・サウンド・ゲームバランスの数値まで作り込み済みです。下記の数値・挙動を忠実に再現してください。なお全パラメータはプロトタイプの Tweaks パネルで調整可能になっており、**最終確定値はプロトタイプを開いて Tweaks → 「📋 仕様書を出力」で生成される Markdown が常に最新の正です**（`SPEC_confirmed.md` はデフォルト値のスナップショット）。

---

## 全体構成

### 論理キャンバス
- **360 × 680 px（9:17 縦長ポートレート）** の固定論理座標で全てを計算。
- 画面には `Math.min(vw/360, vh/680)` でスケールしてレターボックス表示（中央寄せ）。操作系（ボタン等）はスケール対象の外側に置く方針。
- 赤ちゃんの基準 Y 位置 `BABY_Y = 680 × 0.70 = 476`。横方向の可動域は `MARGIN=48`〜`W-48`。
- 5 レーン（`LANES=5`）。レーン X = `48 + i*(360-96)/4`（i=0..4 → 48, 114, 180, 246, 312）。

### 画面（スクリーン）3種
1. **タイトル** — ロゴ＋ハイハイする赤ちゃんプレビュー＋名前入力＋「はじめる」＋操作ヒント＋ベスト記録。
2. **ゲーム（playing）** — 上部 HUD（体力ゲージ・不快度ゲージ・現在m・BEST m・名前）。被弾時に画面シェイク。
3. **ゲームオーバー（over）** — 「ゲームオーバー」見出し＋「すやすや… おやすみなさい」＋「〔名前〕は ねむっちゃった」、布団で**仰向けに眠る赤ちゃん**＋浮遊する ZZZ＋今回m／ベストm＋「もういっかい」「タイトル」。

---

## ゲームロジック（コア）

毎フレーム `dt = min(0.05, 経過秒)` で更新。playing 中のみ `step(dt)` を実行。

### スクロールと距離
- 背景・オブジェクトは **下方向へ `scrollSpeed` px/s** で流れる（赤ちゃんは画面内で前進している表現）。
- 距離 `distancePx += scrollSpeed*dt`、スコア（m）= `floor(distancePx / 38)`（**38px = 1m**）。
- **接触フリーズ中（後述）は距離・スコアの加算を停止**する。

### 赤ちゃんの横移動
- キー入力（←→ / A D）押下中は `babyX ± babyMoveSpeed*dt`（押している間だけ移動）。
- ドラッグ（マウス／タッチ）中は指の論理X座標へ、1フレーム最大 `babyMoveSpeed*dt` で追従。
- 可動域は `[48, 312]` にクランプ。

### 体力（stamina）と不快度（discomfort）
- 初期＝最大＝`staminaStart`（既定 100）。
- 体力は**時間で減少**：`stamina -= drainPerSec * dt * mult`。`mult` は不快度が `discomfortThreshold`（既定80）% 以上のとき `drainMultiplier`（既定2）、それ未満は1。
- 不快度は体力消費の **2倍速** で自動上昇：`discomfort = min(100, discomfort + (drainPerSec*2)*dt)`。100% で HUD に「！パンパン！」を表示。
- **体力 0 でゲームオーバー**（350ms 後に over 画面へ遷移）。
- ※ `SPEC_confirmed.md` の旧記述「距離 0.35/m」は**時間ベースに改訂済み**。上記の `drainPerSec`（秒あたり）が正。

### スポーン
- `spawnAcc += dt`、`spawnAcc >= spawnInterval` ごとに1体スポーン。
- カテゴリ抽選：`obstacleRate : toyRate : itemRate` の重みでランダム（既定 例: easy=30:30:40 / normal=45:30:25 / hard=55:30:15）。
- 回復アイテムは `bottleShare`%（既定60）で哺乳瓶、残りでオムツ。
- 障害物／おもちゃはそのカテゴリの種類リストから等確率。レーンはランダム。
- スポーン位置 `y = -44`（画面上端の外）。動的オブジェクトは初速 `vx = ±scrollSpeed*(0.28〜0.58)`（斜め移動）。

### オブジェクト一覧

| kind | 表示名 | カテゴリ | 動的? | サイズ(base px) |
|---|---|---|---|---|
| `chair` | 椅子 | obstacle | × 静的 | 76（大） |
| `ball` | ボール | toy | ○ 動的 | 54（中） |
| `teddy` | テディベア | toy | × 静的 | 76（大） |
| `duck` | アヒルのおもちゃ | toy | × 静的 | 42（小） |
| `bottle` | 哺乳瓶 | item | × 静的 | 54（中） |
| `diaper` | オムツ | item | × 静的 | 54（中） |

- **動的オブジェクト**（ball）は下方向に `scrollSpeed*1.5`（=通常＋0.5倍）で速く落ち、さらに `vx` で横移動。`x<26` / `x>W-26` の側壁で反射。傾き表示 `rotate(clamp(vx/12, ±22)deg)`。
- **静的オブジェクト**は背景と同じ `scrollSpeed` で素直に下降。
- `y > H+80` で配列から除去。

### 衝突
- 各オブジェクト半径 `r = base * scale * 0.42`。判定は `|o.x-babyX| < r+24 && |o.y-476| < r+26` の矩形近似。
- **item**（哺乳瓶・オムツ）：即時取得（`hit=true`）。
  - 哺乳瓶 → `stamina = min(max, stamina + max*bottleHealPct/100)`、緑ポップ「+体力」、SE `bottle`。
  - オムツ → `discomfort = 0`、青ポップ「おむつ交換！」、SE `diaper`。
- **obstacle / toy**：無敵時間中（`elapsed <= invincibleUntil`）は無視。当たると `hit=true` ＋ダメージ。
  - 障害物 → `stamina -= obstacleDamage`（既定10）、`invincibleType='hurt'`、接触アニメ hurt、`shake=1`、赤ポップ「いたっ！」、SE `obstacle`。
  - おもちゃ → `stamina -= toyDamage`（既定10）、`invincibleType='play'`、接触アニメ play、橙ポップ「遊んじゃった！」、SE `toy`。
  - 共通で `invincibleUntil = elapsed + invincibleTime`（既定1.0s）。

### 接触フリーズ・無敵・点滅
- **接触フリーズ**：被弾時 `contact = {type, t:0, dur:contactTime}`（既定0.6s）。フリーズ中は**スクロール・距離・スポーン・体力消費・衝突判定を停止**（横移動と接触アニメ・ポップ・シェイク減衰は継続）。`t>=dur` で解除。
- **無敵**：`invincibleTime`（既定1.0s）。
- **点滅**：`hurt` 無敵のときのみ赤ちゃんが点滅（`floor(elapsed*12)%2` で opacity 1↔0.35）。**おもちゃ（play）では点滅しない**。
- **画面シェイク**：`shake` を `1` から `dt/shakeDuration` で減衰。`playfield` を `translate(±shakeIntensity*shake のランダム)` で揺らす。

### ポップテキスト（数値演出）
- `{text, color, x, y, t}`。毎フレーム `t+=dt`、`top = y - t*46`（上昇）、`opacity = 1 - t/1.1`、`t>=1.1` で除去。
- 色：+体力=緑`#37b24d` / おむつ交換！=青`#2f86d6` / いたっ！=赤`#e8503a` / 遊んじゃった！=橙`#e88b1a`。

### 接触バースト（頭上の大きいテキスト）
- 被弾中、赤ちゃん頭上（`BABY_Y-70`）に「いたっ！」（hurt）／「わーい！」（play）を大きくスケールイン表示。
- アニメ `burst`：0.4s `cubic-bezier(.2,1.4,.4,1)`、scale 0.3→1.15→1・回転 -12°→4°→0°・上方向へ少し移動。

---

## アニメーション（赤ちゃんスプライト）

赤ちゃんは**カメラから見て後ろ姿（後頭部が見える）でハイハイ**。四肢は2点キャプセル（肩/腰→手/足）の根本ベクトルを前後に振って表現。`phase`（0..1）は `crawlCyclesPerSec*(scrollSpeed/200)` で進む（スクロール速度に比例）。上下バウンド `bounceHeight`（既定7px）。

### ハイハイ 3種（`crawlStyle`）
- **A 対角（diagonal・既定の推奨）**：左手＋右膝が交互にリード。`bob = -|sin(2a)|*bounce`。
- **B うさぎ跳ね（bunny）**：両腕→両脚。`bob = -(max(0,sin a)^1.4)*bounce*2`。
- **C くねくね（wiggle）**：体を左右に振る。`sway=sin(a)*8`, `tilt=sin(a)*5`。

### 被弾演出 3種（`hurtStyle`）
- **A 点滅（flash・既定）**：点滅＋赤グロー＋色相シフト＋小刻みジッター（`translateX(sin(k*6π)*6)`、SVGに `drop-shadow(...red) hue-rotate(-20deg) saturate(1.5)`）。
- **B 回転（tumble）**：`rotate(sin(k*3π)*22deg)`（転ぶ）。
- **C 潰れ（squash）**：縦に押し潰れる `scale(x, 1-sin(kπ)*0.22)`。

### 遊ぶ演出 3種（`playStyle`）
- **A 揺れ（sit）**：座って左右に揺れる `rotate(sin(k*4π)*10deg)`。両手を上げて拍手ポーズ。
- **B 跳ね（bounce・既定）**：その場で跳ねる `translateY(-|sin(k*3π)|*16)`。
- **C 回転（spin）**：一回転 `rotate(k*360deg)`。

### その他表情・演出
- 不快度80%以上：困り顔＋汗の表情に切替（`worried` フラグ）。
- ゲームオーバーの眠る赤ちゃん（`SleepingBaby`）：布団＋枕に横向き／うつ伏せ気味、頬が潰れる、ゆっくり呼吸（`sin(t*1.6)`）。ZZZ は上昇＋拡大＋フェードでループ。

---

## サウンド（Web Audio 合成）

`GameAudio` シングルトン。効果音は既定 **ON**、子守唄BGMは既定 **OFF**。マスターゲイン 0.5。

- **効果音**：
  - `bottle`：C5-E5-G5 上昇3音（triangle）。
  - `diaper`：300→180Hz グライド＋ローパスノイズ（ポフ）。
  - `obstacle`：180→90Hz の低音（sawtooth、ouch）。
  - `toy`：E5-A5 の楽しい2音（square）。
  - `start`：C5→G5 の2音（triangle）。
  - `gameover`：E5-C5-G4-E4 の下降フレーズ＋低い C4 余韻。
- **子守唄BGM**：C major・約70BPM。8音フレーズ×2種をループ（`[60,64,67,64,65,64,62,60]` / `[60,62,64,67,65,64,62,67]`、MIDIノート番号）。ダウンビート（各フレーズ先頭）でオクターブ下を重ねて温かく。`setInterval(60000/70/2)` で刻む。

---

## 操作

- **← →** / **A D**：左右移動（押している間だけ移動）。
- **ドラッグ（マウス／タッチ）**：指の位置へ追従。
- **Space / Enter**：開始・再開（タイトル／ゲームオーバーで）。

---

## デザイントークン

### フォント
- 日本語：`'M PLUS Rounded 1c'`（500/700/800）。本文・UI全般。
- ラテン／数字・ロゴ：`'Baloo 2'`（500–800）。スコア・見出し・タイトルロゴ。
- いずれも Google Fonts。丸ゴシックで親しみやすい絵本トーンを保つこと。

### カラー
| 用途 | 値 |
|---|---|
| 基調インク（文字） | `#5a4a3a` |
| タイトルピンク | `#ff7a9c` / ボタン `#ff9bb6`→`#ff7a9c`、影 `#e35f81` |
| バッジ／ベスト | `#e98aa6` |
| 体力ゲージ | >50%=`#ff6b81` / >25%=`#ff9f43` / それ以下=`#a4313f` |
| 不快度ゲージ | `#9ad6c0`→`#3a5a4a` の補間 |
| 肌の色（候補3） | `#ffd9bf`（既定相当）/ `#f0bf9a` / `#c89271` |
| 服の色（候補4） | ピンク`#ffb3c7` / ブルー`#aaccf5` / イエロー`#ffe08a` / ミント`#a9e0c4` |
| ポップ色 | 緑`#37b24d` / 青`#2f86d6` / 赤`#e8503a` / 橙`#e88b1a` |
| ゲームオーバー背景 | 紺グラデ `rgba(40,44,90,.5)`→`rgba(30,34,70,.62)`、文字 `#dfe4ff`/`#c2c9ee` |

色の濃淡は `shade(hex, amt)` ヘルパー（±で明暗）で派生させている。肌・服から自動で陰影色を生成。

### 背景テーマ（`theme`）— スクロール量でループ
- **room（おへや）**：はちみつ色の木目フロア（板が奥へ走る／継ぎ目がスクロール）＋中央に織りラグ。`#d8a667`/`#cf9b58` ベース。
- **park（こうえん）**：草地グラデ `#bfe3a0`→`#a6d585` ＋花・光の粒、中央は小道（木目調ストライプ）。
- **night（よる）**：紺グラデ `#2c3168`→`#191d45` ＋星、中央は光るカーペット。
- 中央 1/3 の「ランナー」帯（`centerRunner`）はテーマごとに別模様。

### サイズ・形状
- ステージ角丸 30px、`box-shadow:0 24px 70px rgba(120,90,60,.30)` ＋内側ハイライト。
- ゲージ：高さ13px、`border-radius:999px`、内側影。
- ボタン：角丸18px、立体影（`0 5px 0` の段差＋ドロップ）、`:active` で4px沈む。
- HUD名前バッジ：角丸999px、`rgba(120,90,60,.4)`＋blur。

---

## 状態管理（必要な state）

- **画面状態** `screen`：`title | playing | over`。
- **ゲーム状態**（プロトタイプでは ref に持ち、rAF で直接ミューテート＋強制再描画）：`babyX, targetX, stamina, maxStamina, discomfort, distancePx, score, objects[], spawnAcc, phase, contact, invincibleUntil, invincibleType, shake, popups[], elapsed, over`。
  - ※ React で 60fps の物理を回すため ref＋手動再描画にしているが、**ターゲット環境では普通のゲームループ／ECS／`requestAnimationFrame` ループに置き換えてよい**。React state で毎フレーム setState する必要はない。
- **入力** `keys{left,right}`、`dragging`。
- **結果** `lastResult{score,dist}`、`best{dist,score}`。
- **チューニング値** `t`（下記パラメータ群）。本番では設定ファイル／定数として持つ。

### 永続化（localStorage）
- `baby_crawl_best`：ベスト距離（JSON `{dist, score}`）。
- `baby_crawl_name`：赤ちゃんの名前。

---

## チューニング・パラメータ（既定値）

> プロトタイプの Tweaks パネルで全て調整可。最終確定値は「📋 仕様書を出力」の Markdown を正とする。以下は推奨初期値。

```
# 速度
scrollSpeed        = 200   px/s     # プリセット slow=130 / normal=200 / fast=280
babyMoveSpeed      = 440   px/s     #          slow=360 / normal=440 / fast=520
PX_PER_M           = 38    px = 1m

# 難易度（プリセット easy / normal / hard）
spawnInterval      = 0.75  s        # easy=1.0 / normal=0.75 / hard=0.55
obstacleRate       = 45    %        # easy=30  / normal=45   / hard=55
toyRate            = 30    %        # 全プリセット 30
itemRate           = 25    %        # easy=40  / normal=25   / hard=15
bottleShare        = 60    %        # 残り40% がオムツ

# パラメータ挙動
staminaStart       = 100            # 初期＝最大
drainPerSec        = 0.35 〜 2 /s   # 時間あたり体力消費（不快度80%↑で ×drainMultiplier）
obstacleDamage     = 10
toyDamage          = 10
bottleHealPct      = 20    %        # 最大体力に対する回復量
discomfortThreshold= 80    %
drainMultiplier    = 2     x
invincibleTime     = 1.0   s
contactTime        = 0.6   s        # 接触フリーズ

# アニメーション
crawlStyle         = diagonal       # diagonal / bunny / wiggle
hurtStyle          = flash          # flash / tumble / squash
playStyle          = bounce         # sit / bounce / spin
crawlCyclesPerSec  = 2.2  /s
bounceHeight       = 7     px
shakeIntensity     = 8     px
shakeDuration      = 0.3   s

# 見た目・音
skin   = #ffd9bf,  cloth = #ffb3c7,  theme = room
sfxOn  = true,     bgmOn = false
name   = （プレイヤー入力）
```

---

## アセット

- **画像アセットはゼロ**。キャラクター・アイテム・障害物・背景はすべて `reference/sprites.jsx` 内のインライン SVG（手描き風・絵本トーン）。
  - `Baby`（ハイハイ・後ろ姿、3変種＋hurt/playポーズ）、`SleepingBaby`（ゲームオーバーの就寝）、`Zzz`、`Bottle / Diaper / Chair / Ball / Teddy / Duck`、背景生成 `bgStyle / centerRunner`。
  - ターゲット環境では SVG をそのまま使う／ネイティブのベクター描画やスプライトに置き換える、いずれも可。色は肌・服のトークンから `shade()` で派生させている点に注意。
- **音声アセットもゼロ**。`reference/audio.jsx` の Web Audio 合成。ネイティブ実装ではサンプル音源に差し替えてもよいが、上記の音色・音程の意図を踏襲すること。
- フォントのみ外部依存（Google Fonts: M PLUS Rounded 1c / Baloo 2）。

---

## 実装の推奨

- 新規実装するなら：**60fps の固定ステップなゲームループ**を素直に書ける構成が向く。Web なら Canvas/PixiJS や素の DOM＋rAF、モバイルなら SwiftUI/Compose のタイムライン、ゲームエンジンなら Unity/Godot 等。React の state ではなく専用ループで物理を回すこと（プロトタイプの ref＋強制再描画はあくまで HTML 上の制約回避）。
- 論理座標 360×680 を基準に、実画面へスケール＋レターボックスする方針は踏襲推奨（縦長スマホに最適）。
- ゲームバランス値は**ハードコードせず設定として外出し**し、調整しやすくしておくこと（プロトタイプの Tweaks がそのまま設計図になる）。

---

## ファイル一覧（`reference/`）

| ファイル | 内容 |
|---|---|
| `index.html` | エントリ。フォント読込・全体CSS（HUD/オーバーレイ/タイトル/ゲームオーバー/仕様モーダルのスタイル）・Tweak既定値・スクリプト読込順。 |
| `game.jsx` | コアゲームループ、衝突、入力、HUD、Stage スケーリング、ゲーム状態。`<App/>` をマウント。 |
| `screens.jsx` | タイトル／ゲームオーバー画面、Tweaks パネル内容、仕様書 Markdown 出力。 |
| `sprites.jsx` | 全 SVG キャラ／アイテム／障害物／背景。`Baby`/`SleepingBaby` のアニメ変種ロジック含む。 |
| `audio.jsx` | Web Audio による効果音・子守唄BGM 合成（`GameAudio`）。 |
| `tweaks-panel.jsx` | プロトタイプ調整用 UI（本番には不要。パラメータの全リストとして参照可）。 |
| `../SPEC_confirmed.md` | 確定仕様（デフォルト値スナップショット。最新値はプロトタイプの出力を正とする）。 |

> プロトタイプを実際に動かして確認するには `reference/index.html` をブラウザで開いてください（ネット接続が必要：フォント＋React CDN）。右下の Tweaks で全パラメータを触りながら挙動を確認できます。
