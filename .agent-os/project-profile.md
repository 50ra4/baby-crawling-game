<!--
Role: the single, trustworthy description of THIS project — what it is,
how it is verifiably built/tested, and what is still uncertain.
Written by: the agent, during the project-bootstrap skill (initial fill)
and the project-profile skill (updates after structural change or when a
recorded fact is proven wrong). Read at the start of every task.

Golden rule: every fact below must cite where it was observed (a file, a
command output, a direct statement from the user). If you cannot cite it,
it is a guess — put it under "Hypotheses (unverified)" instead.

Last updated: 2026-07-07 (project-bootstrap, initial fill).
-->

# Project Profile: baby-crawling-game

## Project overview

- 赤ちゃんがはいはいで進む距離（m）を競う、縦スクロール型の癒し系無限ランナー。左右移動でおもちゃと遊び、一定間隔で流れる哺乳瓶・オムツで体力／不快度を管理する。（`README.md`、`docs/specs/product.md`）
- 単一パッケージの React + Vite SPA。モノレポではない（`workspaces`/`pnpm-workspace.yaml`/`turbo.json`/`lerna.json` は不在）。（`docs/specs/structure.md` §1、`package.json`）
- GitHub Pages 公開。公開時の base path は `/baby-crawling-game/`。（`docs/specs/tech.md` §3、`.github/workflows/`）

## Tech stack (observed)

- 言語 TypeScript 6.0.3 / React・React DOM 19.2.7 / Vite 8.1.0 / `@vitejs/plugin-react` 6.0.3。（`package.json`、`docs/specs/tech.md` §1）
- スタイル Tailwind CSS v4（`@tailwindcss/vite`）。トークンと全 UI スタイルは `src/globals.css` の `@theme`。（`package.json`、`docs/specs/structure.md` §2）
- テスト Vitest 4.1.9 + jsdom + Testing Library（`globals: true`/`environment: jsdom`/`setupFiles: ./src/test/setup.ts`）。（`vite.config.ts`、`docs/specs/tech.md` §2）
- Lint ESLint フラット config（`@eslint/js` + typescript-eslint recommended + react-hooks）。Format Prettier（シングルクォート・セミコロン・`trailingComma: all`・`tabWidth: 2`）。（`eslint.config.js`、`.prettierrc`）
- ランタイム依存は `react`/`react-dom` のみ。他はすべて devDependencies。Supabase・バックエンド・DB は無い。（`package.json` dependencies）
- アセット: 画像は PNG（`src/assets/sprites/*.png`、Vite が import 解決）。音声は外部ファイル無しで Web Audio 合成（`src/audio/gameAudio.ts`）。Node は `.nvmrc` = 24.17.0。

## Directory structure (observed)

- `src/types/game.ts` 共通型（リテラルユニオン中心）。`src/constants/gameConfig.ts` 論理寸法・`OBJECT_META`・`KINDS`・`DEFAULT_CONFIG`。
- `src/game/` ゲームロジック（純粋関数・React 非依存・各 `*.test.ts` 同梱）: `gameStep`/`createGameState`/`contact`/`movement`/`stamina`/`spawnObject`/`collision`/`popups`。総合シナリオは `gameSimulation.test.ts`。
- `src/hooks/` rAF ループ・入力集約・時間・モーダル。`src/components/` 描画（sprites/backgrounds/hud/Playfield は stateless、`screens/`・`Stage` は UI ローカル状態を持つ）。`src/audio/` Web Audio シングルトン。`src/utils/` math/color/storage/displayName。`src/App.tsx` は状態集約点。
（出典: `docs/specs/structure.md` §2〜§4、`find src` 実測）

## Verified commands (see command-map.md)

- build=`npm run build` / test=`npm test`・`npm run test:run` / lint=`npm run lint` / format=`npm run format` / run=`npm run dev`。いずれも `.agent-os/command-map.md` に検証済みとして登録（2026-07-07 に build・test:run・lint を実行し成功を確認）。

## Architecture boundaries

- ゲーム物理は `src/game/` の純粋関数に閉じ込め React に依存させない（テスト容易・移植容易）。副作用（音・遷移）はロジックがイベントとして返し、`App` だけが実行する。
- ゲーム進行・共有状態（`config`/`screen`/`gameRef`/`bestRef`）は `App.tsx` に集約。UI ローカルな状態・副作用（`Stage` の縮尺、`TitleScreen` のダイアログ等）は各画面ユニットに閉じ込め、`App` に引き上げない。
- 入力は `ref` 経由で渡し毎フレームの再レンダリングを避ける。依存フローは types → constants → utils → game → hooks → components → App の一方向。
（出典: `docs/specs/structure.md` §3〜§5）

## Naming conventions (observed)

- テストは対象と同ディレクトリ同梱、`*.test.ts(x)`。`it` の説明は「どの条件でどうなるか」を日本語で具体的に書く。（`.claude/rules/testing.md`、実測）
- 分岐はリテラルユニオン型で網羅性を担保。（`docs/specs/structure.md` §3）

## Forbidden changes

- ゲーム物理の純粋関数（`src/game/*`）に React 依存や副作用を持ち込まない。副作用は必ずイベント経由で `App` に返す。
- 状態を `App` と各画面ユニットの二重管理にしない（共有状態のみ `App`）。

## Areas where AI tends to err

- `src/game/` は純粋関数かつ数値ロジックが密。1 フレーム更新（`stepGame`）はサブモジュールを順に呼ぶため、変更時は `gameStep.test.ts`・`gameSimulation.test.ts` を含む全テスト（254 件）で回帰確認が要る。
- `.claude/rules/*`（supabase-admin / testing の一部）は monorepo・Next.js・Supabase を前提とした汎用テンプレートで、本リポジトリの実態（単一 Vite SPA・Supabase 無し）と食い違う箇所がある。規約の「意図」（TypeScript/React/Tailwind の書き方）は適用しつつ、構成の正本は `docs/specs/` とする。（`docs/specs/structure.md` §1 補足）

## Hypotheses (unverified)

- 各画面を `React.lazy` + `Suspense` で遅延読み込みする方針だが「現状は同期 import」と明記されている。実際の分割状況は未確認。（`docs/specs/structure.md` §3）
