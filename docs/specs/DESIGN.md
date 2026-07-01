# UI/UX デザイン仕様（DESIGN）

> 色・タイポグラフィ・コンポーネント・レイアウト・アニメーション。本書は**実装を正本**とし、
> `src/globals.css`・`src/components/hud/gaugeColor.ts`・`src/components/backgrounds/backgroundStyle.ts`・
> `src/components/sprites/`・`src/utils/color.ts` を参照する。
> 関連: [product.md](./product.md) / [tech.md](./tech.md) / [structure.md](./structure.md)

## 1. デザイン方針

絵本トーンの丸ゴシック＋淡いピンク配色。ダークモードは採用しない。論理キャンバス 360×680px を
ビューポートに等比スケールして表示する。ステージは角丸・浮き影を持たず画面いっぱいに配置する
（全画面フィット）。スケール外の余白（レターボックス）はクリーム背景と一体化させ、浮きカードでは
なく「一般的な Web アプリ」として見せる。

## 2. カラー

### 2.1 デザイントークン（`globals.css` `@theme`）

| トークン                | 値        | 用途                                               |
| ----------------------- | --------- | -------------------------------------------------- |
| `--color-ink`           | `#57473c` | 本文・ラベルのダークブラウン                       |
| `--color-ink-soft`      | `#9c8a7d` | 副次ラベル・キャプションのミュートブラウン         |
| `--color-primary`       | `#ff7a9c` | タイトル・強調・プライマリボタンのピンク           |
| `--color-primary-light` | `#ff9fb8` | ボタン明色・グラデーション上部                     |
| `--color-primary-deep`  | `#e15a7e` | ボタン影・3D プレス・フォーカスリング              |
| `--color-border-pink`   | `#ffd8e2` | 入力枠・ボタン枠・ゴースト影                        |
| `--color-badge`         | `#db7595` | バッジ・見出しのライトピンク                       |
| `--color-cream`         | `#f6eee3` | 画面全体の背景基調（放射グラデ重ね）・body 背景    |
| `--color-cream-deep`    | `#ecdfce` | 背景の陰影・帯の深み                               |
| `--color-surface`       | `#ffffff` | カード・パネル・入力の白地                          |
| `--color-surface-warm`  | `#fff8f2` | 温かみのあるパネル地                               |
| ステージ背景            | `#cfe`    | スケーリング枠の地色（通常は背景テーマで覆われる） |

角丸スケール（`@theme`）: `--radius-control: 16px`（ボタン・入力）/ `--radius-card: 20px`
（パネル・統計カード）/ `--radius-pill: 999px`（ピル・ゲージトラック）。ステージは角丸なし。

### 2.2 ゲージ色（`gaugeColor.ts`）

- 体力（残量比で変色）: `>0.5` → `#ff6b81` / `>0.25` → `#ff9f43` / それ以下 → `#a4313f`
- 不快度（おむつ、0→1 で補間）: `mixColor('#9ad6c0', '#3a5a4a', ratio)`（ミント→深緑）

### 2.3 ポップテキスト色（`collision.ts`）

| 文言           | 色              |
| -------------- | --------------- |
| +体力          | `#37b24d`（緑） |
| おむつ交換！   | `#2f86d6`（青） |
| いたっ！       | `#e8503a`（赤） |
| 遊んじゃった！ | `#e88b1a`（橙） |

### 2.4 接触バーストの影（`globals.css`）

- hurt: `0 0 2px #e8503a, 0 3px 0 #c0392b, 0 0 14px #ff8a6a`（文字は白）
- play: `0 0 2px #e88b1a, 0 3px 0 #c47512, 0 0 14px #ffc46a`（文字は白）

### 2.5 オーバーレイ・パネル

| 箇所               | 値                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------- |
| タイトル背景       | `radial-gradient(circle at 50% 30%, rgba(255,250,245,.92), rgba(255,243,235,.96))`     |
| ゲームオーバー背景 | `linear-gradient(rgba(40,44,90,.5), rgba(30,34,70,.62))` + `blur(3px)`                 |
| あそびかた背景     | `rgba(40,44,90,.45)` + `blur(3px)`                                                     |
| あそびかたパネル   | `#fff`、角丸 20px（`--radius-card`）、`shadow 0 16px 40px rgba(40,44,90,.32)`          |
| ステージ枠         | 全画面フィット。角丸・浮き影なし（`overflow:hidden` のみ）                             |
| ゲージトラック     | `rgba(255,255,255,.78)`、`inset 0 1px 2px rgba(87,71,60,.18), 0 1px 0 rgba(255,255,255,.5)` |

### 2.6 赤ちゃんフィルタ（`Baby.tsx`）

- hurt: `drop-shadow(0 0 10px rgba(255,70,70,.95)) hue-rotate(-20deg) saturate(1.5)`
- worried（不快度 ≥ 80%）: `saturate(.85) brightness(.96) hue-rotate(10deg) drop-shadow(0 1px 5px rgba(110,170,255,.85))`

## 3. タイポグラフィ

- 日本語: `'M PLUS Rounded 1c', system-ui, sans-serif`（`--font-jp`）
- ラテン・数字・ロゴ: `'Fredoka', 'M PLUS Rounded 1c', system-ui, sans-serif`（`--font-latin`）

> Fredoka の最大ウェイトは 700。ラテン系の見出し・数字は 700 を最太とする（旧 Baloo 2 の 800 相当）。
> 日本語（M PLUS Rounded 1c）は 800 まで利用可。

| 要素                   | フォント          | サイズ / ウェイト                             |
| ---------------------- | ----------------- | --------------------------------------------- |
| タイトル見出し         | Fredoka           | 40px / 700                                    |
| バッジ                 | Fredoka           | 12px / 700（uppercase, letter-spacing .15em） |
| HUD 距離               | Fredoka           | 30px / 700（単位 m は 14px）                  |
| HUD ベスト             | Fredoka           | 12px / 700                                    |
| ゲージアイコン         | —                 | 11px / 800                                    |
| ゲージ警告             | Fredoka           | 11px / 700（pulse）                           |
| 名前入力               | M PLUS Rounded 1c | 18px / 700                                    |
| 名前ラベル             | —                 | 11px / 700                                    |
| 性別ボタン             | M PLUS Rounded 1c | 15px / 700                                    |
| はじめるボタン         | Fredoka           | 20px / 700                                    |
| あそびかたリンク       | M PLUS Rounded 1c | 13px / 700（underline）                       |
| ゲームオーバー見出し   | Fredoka           | 30px / 700                                    |
| ゲームオーバー小見出し | —                 | 18px / 800                                    |
| 統計値                 | Fredoka           | 30px / 700（単位 14px）                       |
| ポップテキスト         | Fredoka           | 18px / 700                                    |
| 接触バースト           | Fredoka           | 32px / 700                                    |

## 4. コンポーネント

### ボタン

- **Primary**（`.t-start`）: `linear-gradient(#ff9fb8, #ff7a9c)`、白文字、角丸 16px（`--radius-control`）、`shadow 0 5px 0 #e15a7e, 0 10px 18px rgba(225,90,126,.28)`。`:active` で `translateY(4px)` + `shadow 0 1px 0 #e15a7e`（3D プレス）
- **Ghost**（`.t-start.ghost`）: `#fff` 背景、`#ff7a9c` 文字、`shadow 0 5px 0 #ffd8e2`
- ゲームオーバーのボタンは 17px / `padding 11px 26px`
- フォーカス（`:focus-visible`）: `outline 3px solid #e15a7e`（3D 影と競合しないよう outline を使用）

### 名前入力（`.t-name`）

- width 180px、padding 10px 12px、border `2px solid #ffd8e2`、角丸 16px（`--radius-control`）、背景 `#fff`、focus で `border-color #ff9fb8` ＋ `:focus-visible` で `ring 3px rgba(255,122,156,.5)`、最大 8 字

### 性別ボタン（`.t-gender-btn`）

- pill 形（角丸 999px）、padding 8px 22px、border `2px solid #ffd8e2`
- `.active`: `linear-gradient(#ff9fb8, #ff7a9c)` + 白文字 + `shadow 0 3px 0 #e15a7e`、`aria-pressed` 連動
- フォーカス（`:focus-visible`）: `outline 3px solid #e15a7e`

### ゲージ（`.gauge` / `Gauge.tsx`）

- アイコン幅 34px（白文字）＋トラック（高さ 13px、角丸 999px）＋fill
- fill 幅は毎フレーム即時反映（トランジションなし）、色のみ 0.3s フェード
- 警告（不快度 100% で「！パンパン！」）は pulse アニメ

### HUD

- `.hud-top`: 上 12px / 左右 12px、左にゲージ群（最大幅 200px・gap 7px）、右にスコア（右寄せ）
- `.hud-name`: 下 10px・中央、`rgba(120,90,60,.4)` + `backdrop-filter blur(4px)`、角丸 999px

### ポップテキスト（`.popup`）

- 色はポップ種別ごと（§2.3）、`text-shadow 0 2px 0 #fff, 0 0 6px #fff`、上昇＋フェード

### 接触バースト（`.contact-burst`）

- 赤ちゃん頭上に表示、`burst 0.4s cubic-bezier(.2,1.4,.4,1)`、種別で影色が変わる（§2.4）

### あそびかたダイアログ（`HelpDialog`）

- パネル最大幅 320px / 最大高 82% / padding 22px 20px、背景クリックで閉じる
- セクション: そうさ / ステータス / スコア / きをつけて（障害物・おもちゃをスプライト付きで表示） / アイテム（哺乳瓶・オムツ）
- ラベルは `OBJECT_META` から引いて表記ずれを防ぐ。スプライト表示サイズ 40px

## 5. レイアウト

- 論理キャンバス 360×680px（9:17）。スケール = `min(clientWidth/360, clientHeight/680)`、中央配置。ステージは角丸なしの全画面フィット（外側の余白はクリーム背景と一体化）
- 5 レーン: `laneX(i) = 48 + i × 66` → `[48, 114, 180, 246, 312]`（左右マージン 48px）
- 赤ちゃん基準 Y = 680 × 0.7 = 476px、横幅 96px
- フォーム: 名前入力 180px、性別ボタン gap 8px、はじめる `margin-top 16px / padding 13px 40px`

## 6. アニメーション

| 名称                      | 仕様                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------- |
| burst                     | 0.4s `cubic-bezier(.2,1.4,.4,1)`。scale 0.3→1.15→1、rotate −12°→4°→0°、上方向へ移動 |
| pulse                     | 0.5s infinite alternate、scale 1→1.08（ゲージ警告）                                 |
| ハイハイ diagonal（既定） | bob `−                                                                              | sin(phase·2π·2) | ·bounce`、sway `sin(phase·2π)·2px`、tilt `sin(phase·2π)·1.5°` |
| ハイハイ bunny            | bob `−(hop^1.4)·bounce·2`（`hop = max(0, sin(phase·2π))`）                          |
| ハイハイ wiggle           | bob `−                                                                              | sin·2           | ·bounce·0.5`、sway `sin·8px`、tilt `sin·5°`                   |
| 接触 hurt: flash（既定）  | `translateX(sin(k·π·6)·6px)`                                                        |
| 接触 hurt: tumble         | `rotate(sin(k·π·3)·22°)`                                                            |
| 接触 hurt: squash         | `scale(1+(1−s)·0.4, s)`（`s = 1 − sin(k·π)·0.22`）                                  |
| 接触 play: bounce（既定） | `translateY(−                                                                       | sin(k·π·3)      | ·16px)`                                                       |
| 接触 play: sit            | `rotate(sin(k·π·4)·10°)`                                                            |
| 接触 play: spin           | `rotate(k·360°)`                                                                    |
| シェイク                  | `translate(±shakeIntensity·shake)`（強さ 8px / 0.3s 減衰）                          |
| 点滅                      | 無敵中 hurt のみ 12Hz で opacity 0.35                                               |
| 眠る呼吸                  | `translateY(sin(t·1.6)·0.9px)`                                                      |
| ZZZ                       | 3 個が上昇（−56px/周期）＋拡大（14→26px）＋フェード、回転 12°+i·5°、色 `#8b9bd4`    |

> ハイハイ位相は `phase += crawlCyclesPerSec · (scrollSpeed/200) · dt`。既定 `crawlCyclesPerSec = 2.2`、`bounceHeight = 3.5`。

### アクセシビリティ

- **フォーカス可視化**: ボタン・入力・リンクは `:focus-visible` でリング/アウトラインを表示（キーボード操作時のみ）。
- **モーション過敏**: `@media (prefers-reduced-motion: reduce)` で CSS 演出（ゲージ警告 pulse・接触 burst）を停止/即時化する。

## 7. 背景テーマ（`backgroundStyle.ts`）

スクロール量でループ位置を進める。既定は `room`。

| テーマ               | ベース                                                          | 中央ランナー帯                                                       |
| -------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| room（おへや・既定） | 木目 `#d8a667`/`#cf9b58` の縦ストライプ＋暗い板筋・光筋         | `linear-gradient(90deg, …#e7b9c9…#f3e3cf…)` のラグ柄                 |
| park（こうえん）     | `linear-gradient(#bfe3a0, #a6d585)` ＋花・光の粒（radial 3 種） | `repeating-linear-gradient(0deg, #ece0c6 0 22px, #e4d6b6 22px 44px)` |
| night（よる）        | `linear-gradient(#2c3168, #191d45)` ＋星（radial 3 種）         | `linear-gradient(rgba(255,247,200,.34), rgba(255,247,200,.16))`      |

`.runner` は中央 1/3（left/right 33%）、opacity 0.55、`inset shadow`。

## 8. 画像アセット（`src/assets/sprites/`）

| ファイル                                            | 用途                           |
| --------------------------------------------------- | ------------------------------ |
| `baby-crawl.png`                                    | ハイハイ中（プレイ）           |
| `baby-play.png`                                     | 遊び接触中                     |
| `baby-title.png`                                    | タイトルプレビュー             |
| `baby-sleep.png`                                    | ゲームオーバー（眠る赤ちゃん） |
| `ball.png` / `chair.png` / `teddy.png` / `duck.png` | おもちゃ・障害物               |
| `bottle.png` / `diaper.png`                         | 回復アイテム                   |

`public/` に `favicon.png` / `apple-touch-icon.png` / `og-image.png`。
スプライト共通スタイルは `IMG_SPRITE_STYLE`（`display:block; object-fit:contain; pointer-events:none`）で、
ドラッグ操作を画像が奪わないようヒットテストから外す。
