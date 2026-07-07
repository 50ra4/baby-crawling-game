<!--
Role: このプロジェクトで Claude Code が毎ターン読む起点ファイル。短く保つ。
手順は skills、プロジェクト固有の事実・学習履歴は .agent-os/ に置く。
Agent OS（50ra4/fable-like-coding-agent-instruction-system）で導入。
-->

# baby-crawling-game — Claude Code Instructions

プロジェクト非依存の普遍原則は `.agent-os/GLOBAL_AGENTS.md` /
`.agent-os/GLOBAL_CLAUDE.md` にある。まずそれを読む（ここでは再掲しない）。

## ファイルの置き場所

- **このファイル** — 常時読み込みの短いポインタのみ。
- **`.claude/skills/*/SKILL.md`** — 必要時に読むオンデマンド手順（Agent OS の10スキル）。
- **`.claude/agents/*.md`** — 専用サブエージェント（code/architecture/security-reviewer, test-strategist, bug-investigator, instruction-maintainer）。
- **`.claude/rules/*.md`** — 既存の技術別ルール（i18n / react / supabase-admin / tailwind / testing / typescript）。
- **`.agent-os/`** — このプロジェクトの観測事実と学習ルール。

## 各タスク開始時に必ず読む

1. `.agent-os/project-profile.md`, `.agent-os/command-map.md`,
   `.agent-os/risk-map.md`。
2. `.agent-os/learned-rules.md` — `Status: active` のルールは必ず守る。
   `Status: candidate` は観測のみで拘束力なし。`.agent-os/rules/` があれば
   `learned-rules.md` の `Active rules index` をたどりその本体も読む。

## プロジェクト固有の規約（毎ターン適用）

### 回答スタイル

- 常に**日本語**で回答する（結論ファースト、簡潔に）
- 挨拶・前置き・段階報告・絵文字は**禁止**
- 指摘すべきことは**率直に**回答

### Git 操作規約

- `git add -A` は**禁止**。変更ファイルを個別に `git add <file>` で指定
- コミットメッセージは **Why** を記録する

```
<type>: <subject>

<body>  ← Why（変更理由・背景）

<footer>
```

Type: `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore`

## 安全（交渉不可）

- 破壊的操作（`rm -rf`、force-push、データ削除、マイグレーション）はユーザーの
  明示承認なしに行わない。
- 秘密情報（`.env`・鍵・トークン・認証情報）を読み・出力・コミットしない。
- ビルド／テスト等の状態変更コマンドは `.agent-os/command-map.md` に載るものだけ実行し、
  勝手に作らない。読み取り専用調査（`ls`/`cat`/`grep`/`find`/`git status`・`log`・`diff`）は常に可。

## 作業後 / 学習ループ

- 失敗したらコマンド・原因・再発防止を `.agent-os/failure-log.md` に記録（隠さない）。
- 訂正されたら `.agent-os/review-feedback-log.md` に**逐語**で記録。
- テスト・型・lint が失敗／スキップのまま「完了」としない。

## このファイルは短く保つ

手順は skills、プロジェクトの事実と学習履歴は `.agent-os/` に置く。マニュアル化しない。
