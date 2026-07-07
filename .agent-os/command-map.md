<!--
Role: the authoritative, verified list of build/test/lint/typecheck/run
commands for THIS project. Written by: the agent, during the
project-bootstrap skill (initial extraction from manifests/CI) and updated
whenever a command is newly verified or found to no longer work. Read at
the start of every task — agents must not run a command that is not
listed here without first verifying it exists.

Rule: only commands verified to exist may be recorded. Each entry must
cite its evidence (package.json script, Makefile target, CI config, docs).

Scope: this map is the allow-list for build/test/lint/typecheck/run and
any other state-changing command. Read-only inspection (`ls`, `cat`,
`grep`, `find`, `git status`/`log`/`diff`) is out of its scope and is
always permitted.
-->

# Command Map: baby-crawling-game

前提: 依存は `npm install`（`package-lock.json` 由来、2026-07-07 に実行し 252 パッケージ導入を確認）。Node は `.nvmrc` = 24.17.0。

## Build

| Command | What it does | Evidence | Last verified |
|---|---|---|---|
| `npm run build` | `tsc -b && vite build`（型チェック込み本番ビルド） | `package.json` scripts."build" | 2026-07-07（成功） |

## Test

| Command | What it does | Evidence | Last verified |
|---|---|---|---|
| `npm run test:run` | Vitest を 1 回実行（`vitest run`）。CI と同等 | `package.json` scripts."test:run" | 2026-07-07（35 files / 254 tests pass） |
| `npm test` | Vitest を watch 実行（`vitest`）。対話用途 | `package.json` scripts."test" | 2026-07-07（test:run で検証） |

## Lint

| Command | What it does | Evidence | Last verified |
|---|---|---|---|
| `npm run lint` | `eslint .` | `package.json` scripts."lint" | 2026-07-07（エラーなし） |

## Typecheck

| Command | What it does | Evidence | Last verified |
|---|---|---|---|
| `tsc -b` | プロジェクト参照ビルドで型チェックのみ。`npm run build` の前段にも含まれる | `package.json` scripts."build"、`.github/workflows/ci.yml` | 2026-07-07（build 経由で成功） |

## Format

| Command | What it does | Evidence | Last verified |
|---|---|---|---|
| `npm run format` | `prettier --write .`（書き込みを伴う） | `package.json` scripts."format" | 未実行（定義のみ確認） |

## Run

| Command | What it does | Evidence | Last verified |
|---|---|---|---|
| `npm run dev` | Vite 開発サーバー | `package.json` scripts."dev" | 未実行（定義のみ確認） |
| `npm run preview` | ビルド成果物のプレビュー | `package.json` scripts."preview" | 未実行（定義のみ確認） |

## Other

- CI: `.github/workflows/ci.yml` が lint → 型チェック（`tsc -b`）→ test（`vitest run`）→ build（`vite build --base /baby-crawling-game/`）を実行。`deploy.yml` が CI 成功時に GitHub Pages へデプロイ。（`docs/specs/tech.md` §3）
