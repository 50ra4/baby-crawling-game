---
paths: ['**/*.test.*', '**/*.spec.*']
---

# テスト規約

> iterate-team ハーネスでは `reviewer: codex` のタスクで `team-test-coder` が実装前にテストを先行作成し（Red）、`team-generator` が緑化（Green）、`team-refactor` が `/simplify`・`/code-review` で実装後に整理する（Refactor）。本規約は test-coder が作成するテストにも適用される（`.iterate-harness/agents/_partials/tdd-policy.md` 参照）。

## ユニットテスト（Vitest）

- テスト対象と同じディレクトリに配置（例：`Button/Button.test.tsx`）
- vitest + @testing-library/react で `describe` / `it` / `expect`
- `describe`: テスト対象、`it`: 「どの条件でどうなるか」を日本語で具体的に

```typescript
// OK
it('正解時にヒット数が正しくカウントされる', () => {});

// NG
it('works correctly', () => {});
```

## E2E テスト（Playwright）

- `packages/e2e/tests/` 配下に配置。ファイル拡張子は `.spec.ts`
- クリティカルパス（ログイン → リスト作成 → アイテム追加/完了）を CI 必須で実行
- 実行コマンド: `npx playwright test packages/e2e/tests/path/to/file.spec.ts`

## コントラクトテスト（横断的）

- `packages/contract-tests/` 配下に配置（vitest ベース）
- feature 間の契約（エラー形状・スキーマ整合性など）をファイルシステムレベルで検証
- feature パッケージのソースを直接 `readFileSync` で読み込み、違反を検出する
