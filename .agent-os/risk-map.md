<!--
Role: the observed map of dangerous areas in THIS project — where an agent
must stop and ask before acting. Written by: the agent, during the
project-bootstrap skill (initial observation of migrations, deploy, infra,
generated code) and updated whenever a new fragile spot or secret location
is discovered. Read at the start of every task, alongside
project-profile.md and command-map.md.

Last updated: 2026-07-07 (project-bootstrap, initial fill).
-->

# Risk Map: baby-crawling-game

## Dangerous areas (migrations, deploy, infra, prod config, generated code)

- `.github/workflows/deploy.yml` — CI 成功時に GitHub Pages へ自動デプロイ。触る前に承認を得る。（`docs/specs/tech.md` §3）
- `.github/workflows/ci.yml` — lint/型/test/build の門番。壊すと全 PR がブロックされる。
- `vite.config.ts` の `base`（公開時 `/baby-crawling-game/`）— 誤ると Pages 上でアセット 404。（`docs/specs/tech.md` §3）
- `dist/` — ビルド生成物。手で編集しない。
- DB マイグレーション・インフラコードは存在しない（バックエンド無しの静的 SPA）。

## Files/directories requiring approval before change

- `src/game/*` — ゲーム物理の純粋関数。数値ロジックが密で回帰しやすい。変更時は全テスト（`npm run test:run`、254 件）で確認し、`gameStep.test.ts`・`gameSimulation.test.ts` の緑を必須とする。
- `src/App.tsx` — 共有状態（`config`/`screen`/`gameRef`/`bestRef`）の単一集約点。状態の二重管理を招く変更は要注意。
- `src/globals.css` — Tailwind v4 の `@theme` トークンと全 UI スタイル。デザイン全体に波及する。
- `src/assets/sprites/*.png` — バイナリ資産。差し替えは意図を確認してから。

## Known fragile spots

- 副作用（音・画面遷移）はロジックがイベントとして返し `App` だけが実行する契約。`src/game/` に直接 `Audio`/DOM/React を持ち込むと契約破壊。（`docs/specs/structure.md` §3, §5）
- 入力は `ref` 経由で毎フレームの再レンダリングを避けている。`useState` 化すると性能劣化。
- `.claude/rules/supabase-admin.md` と `testing.md` の一部は別プロジェクト（monorepo / Next.js / Supabase / iterate-harness）前提のテンプレートで、本リポジトリには当てはまらないパスや前提を含む。これらの記述をそのまま本リポジトリに適用しない（`docs/specs/` を正本とする）。

## Secrets locations (paths only — never contents; agents must never read these)

- 現状リポジトリに `.env` 等の秘密ファイルは観測されていない。GitHub Actions のデプロイ権限は Actions の `GITHUB_TOKEN`／Pages 設定で管理され、リポジトリ内に平文の鍵は無い前提。将来 `.env*` が現れたら中身を読まず、パスのみここに追記する。
