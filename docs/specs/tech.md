# 技術仕様（tech）

> 技術スタック・環境・PACT 契約要点。本書は**実装を正本**とし、`package.json`・各設定ファイル・
> `.github/workflows/` を参照する。
> 関連: [product.md](./product.md) / [structure.md](./structure.md) / [DESIGN.md](./DESIGN.md)

## 1. 技術スタック

| 分類             | 採用                                                 | バージョン              |
| ---------------- | ---------------------------------------------------- | ----------------------- |
| 言語             | TypeScript                                           | 6.0.3                   |
| UI               | React / React DOM                                    | 19.2.7                  |
| ビルド           | Vite                                                 | 8.1.0                   |
| React プラグイン | @vitejs/plugin-react                                 | 6.0.3                   |
| スタイル         | Tailwind CSS（`@tailwindcss/vite`）                  | 4.3.1                   |
| テスト           | Vitest / jsdom                                       | 4.1.9 / 29.1.1          |
| テスト補助       | @testing-library/react・jest-dom・user-event         | 16.3.2 / 6.9.1 / 14.6.1 |
| Lint             | ESLint・typescript-eslint・eslint-plugin-react-hooks | 10.5.0 / 8.62.0 / 7.1.1 |
| Format           | Prettier・prettier-plugin-tailwindcss                | 3.8.4 / 0.8.0           |

- ランタイム依存は `react` / `react-dom` のみ。その他は devDependencies。
- **アセット**: 画像は PNG（`src/assets/sprites/*.png`、Vite が import 解決）。音声は外部ファイルを使わず Web Audio API で合成（`src/audio/gameAudio.ts`）。フォントのみ Google Fonts に外部依存。

## 2. 環境・設定

- Node: `.nvmrc` = `24.17.0`
- モジュール: `"type": "module"`（ESM）
- TypeScript: ルート `tsconfig.json` が `tsconfig.app.json`（アプリ）と `tsconfig.node.json`（ツール）を composite 参照
  - app: target `ES2022` / module `ESNext` / `jsx: react-jsx` / `strict` / `noUnusedLocals` / `noUnusedParameters` / `moduleResolution: bundler` / `verbatimModuleSyntax`
- Vite: `vite.config.ts` で `react()` + `tailwindcss()` プラグイン。Vitest は `globals: true` / `environment: jsdom` / `setupFiles: ./src/test/setup.ts` / `css: true`
- Prettier: シングルクォート・セミコロン・`trailingComma: all`・`arrowParens: always`・`tabWidth: 2`・`endOfLine: lf`
- ESLint: フラット config（`eslint.config.js`）。`@eslint/js` + `typescript-eslint` recommended + react-hooks ルール

### npm scripts

| script              | 内容                                               |
| ------------------- | -------------------------------------------------- |
| `dev`               | Vite 開発サーバー                                  |
| `build`             | `tsc -b && vite build`（型チェック込み本番ビルド） |
| `preview`           | ビルド成果物のプレビュー                           |
| `test` / `test:run` | Vitest（watch / 1 回）                             |
| `lint`              | `eslint .`                                         |
| `format`            | `prettier --write .`                               |

## 3. CI/CD（GitHub Actions）

- `.github/workflows/ci.yml`: `.nvmrc` ベースの Node セットアップ（npm キャッシュ）→ lint → 型チェック（`tsc -b`）→ test（`vitest run`）→ build（`vite build --base /baby-crawling-game/`）
- `.github/workflows/deploy.yml`: CI 成功時に GitHub Pages へ自動デプロイ（`dist/` アーティファクト）
- 公開時の base path は `/baby-crawling-game/`

## 4. アーキテクチャ概要

- ゲーム物理は React 非依存の**純粋関数**（`src/game/`）。状態は不変更新（スプレッド）で、直接ミューテーションしない。
- `useGameLoop`（`requestAnimationFrame`）が毎フレーム `stepGame` を呼び、結果状態を `ref` に書いて強制再描画する。
- 副作用（効果音・ゲームオーバー）はロジックが**イベント配列**として返し、呼び出し側（`App`）が消費する（event-driven）。
- 入力は React 状態ではなく `ref`（`InputState`）に保持し、再レンダリングを起こさない。
- 詳細なユニット構成は [structure.md](./structure.md) を参照。

## 5. PACT 契約要点

本プロジェクトはバックエンド／API を持たないフロントエンド単体のため、Provider/Consumer 間の
契約テスト（Pact）は存在しない。ここでは置き換えとして **(A) アプリ内モジュール間の契約** と
**(B) 外部環境との契約** を要点として記す。

### A. 内部モジュール契約

- **ゲームステップ**: `stepGame(state: GameState, dt: number, config: GameConfig, input: InputState): StepResult`
  - 純粋関数。`dt` は秒（呼び出し側で `MAX_DT = 0.05` にクランプ）
  - 戻り値 `StepResult = { state: GameState; events: GameEvent[] }`
- **副作用イベントプロトコル** `GameEvent`（`src/types/game.ts`）:
  - `{ type: 'sfx'; name: SfxName }` — 効果音再生を要求
  - `{ type: 'gameover'; dist: number; score: number }` — ゲームオーバー（距離＝スコア）
  - 消費側は `App.handleEvents`。`sfx` は `gameAudio.sfx(name)`、`gameover` はベスト更新＋画面遷移
- **入力契約** `InputState = { left: boolean; right: boolean; targetX: number | null }`
  - `targetX` はタップ/ドラッグの論理 X 目標。キー操作時は `null` にクリア
- **型境界**: `GameConfig`（バランス調整値）・`GameState`（毎フレーム可変）・`ObjectKind`/`ObjectCategory`/`GameScreen`/`ContactType`/`CrawlStyle`/`HurtStyle`/`PlayStyle`/`Theme`/`Gender` などリテラルユニオンで分岐の網羅性を担保
- **オーディオ契約** `gameAudio`（`createGameAudio`）: `init()` / `setSfx(on)` / `setBgm(on)` / `sfx(name)` を公開するシングルトン

### B. 外部依存契約

- **Google Fonts**: `M PLUS Rounded 1c`（日本語）/ `Baloo 2`（ラテン・数字・ロゴ）。未読込時は `system-ui, sans-serif` へフォールバック
- **Web Audio API**: `window.AudioContext ?? window.webkitAudioContext`。マスターゲイン 0.5。ユーザー操作後に `resume()`。効果音・子守唄 BGM（C major・70BPM）をすべて合成
- **localStorage**: キー `baby_crawl_best` / `baby_crawl_name` / `baby_crawl_gender`（[product.md](./product.md) §7）。例外時は try/catch で握り潰し既定値へフォールバック
- **GitHub Pages base path**: 公開ビルドは `--base /baby-crawling-game/`。アセット参照はこの base 前提
- **ビューポート**: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no`、`theme-color`。論理 360×680 をビューポートにスケール
