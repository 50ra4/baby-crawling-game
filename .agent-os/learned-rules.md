<!--
Role: durable, promoted behavioral rules for THIS project — the output of
the Learning Layer. Written by: the agent, during the learn-from-feedback
skill (new/updated rules from corrections and failures) and improve-
instructions (merging duplicates, marking deprecated). Read at the start
of every task; only Status: active rules are binding.

Promotion criteria:
- 1 occurrence → Status: candidate（観測のみ、拘束力なし）。
- 2+ occurrences of the same substance → Status: active（毎セッション拘束）。
- Stale / conflicting → Status: deprecated（削除せず理由を残す）。
- Rules must be observable and checkable, never vague wording.

Initially this file holds everything in one place. If it grows past
roughly 10 active rules or 300 lines, run `scripts/split-learned-rules.sh
--adapter <dir>` to move `Status: active` rule blocks into
`.agent-os/rules/<scope>.md`.
-->

# Learned Rules: baby-crawling-game

## Active rules

## Rule: 常に日本語・結論ファースト・前置きなしで回答する

Status: active
Source: user-feedback（導入前から存在した `CLAUDE.md` の確立済み規約）
Scope: project
Applies to:
- すべてのユーザー応答

Rule:
- 常に日本語で回答する（結論ファースト、簡潔に）。
- 挨拶・前置き・段階報告・絵文字は書かない。
- 指摘すべきことは率直に述べる。

Rationale:
- プロジェクトオーナーが確立した既存の対話規約。トーンと簡潔さの一貫性を保つ。

Validation:
- 応答が日本語で、前置き・絵文字を含まず結論から始まっているか。

## Rule: git add -A を使わず、コミットは Why を記録する

Status: active
Source: user-feedback（導入前から存在した `CLAUDE.md` の確立済み規約）
Scope: project
Applies to:
- すべての git コミット操作

Rule:
- `git add -A` は使わない。変更ファイルを個別に `git add <file>` で指定する。
- コミットメッセージの body に Why（変更理由・背景）を記録する。
- Type は `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore` から選ぶ。

Rationale:
- 意図しないファイルの巻き込みを防ぎ、履歴から変更理由を追えるようにする。

Validation:
- `git log` で各コミットに Why が書かれ、`git add -A` を使っていないか。

## Rule: src/game/ の純粋関数を変更したら全テストで回帰確認する

Status: active
Source: review（`docs/specs/structure.md` の設計契約＋project-bootstrap の観測）
Scope: directory
Applies to:
- `src/game/**`

Rule:
- `src/game/` は React 非依存・副作用なしの純粋関数に保つ。副作用（音・遷移）はイベントとして返し `App` だけが実行する。
- 変更後は `npm run test:run`（254 件）を通し、特に `gameStep.test.ts` と `gameSimulation.test.ts` の緑を確認する。

Rationale:
- 数値ロジックが密で回帰しやすく、1 フレーム更新は複数サブモジュールに波及するため。

Validation:
- `npm run test:run` が全件パスすること。

## Candidate rules

<!-- None yet. Populated by learn-from-feedback after a single occurrence. -->
