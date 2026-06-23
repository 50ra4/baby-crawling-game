---
paths: ['**/*.ts', '**/*.tsx']
---

# TypeScript コーディング規約

## 基本原則

- シンプルさ優先（読みやすさ > 短いコード、明示的 > 暗黙的）
- `any` 型禁止 → `unknown` + 型ガード。型推論を活用
- Zod でランタイムバリデーション。`z.output<typeof Schema>` で型推論（手書き型定義禁止）

## パスエイリアスとモジュール解決

- `packages/web` 内のローカル参照のみ `@/` エイリアス（`@/*` → `./app/*`）
- パッケージ間参照は npm workspaces のパッケージ名（`@todo-list-app/*`）
- `tsconfig.json` の `paths` でパッケージ間参照を管理しない

## 命名規則

| 対象                           | ルール                           | 例                            |
| ------------------------------ | -------------------------------- | ----------------------------- |
| ファイル名（コンポーネント）   | パスカルケース、`index.tsx` 禁止 | `Button/Button.tsx`           |
| ファイル名（その他 .ts / .tsx) | キャメルケース、`index.ts` 禁止  | `getUserLists.ts`             |
| 変数・関数名                   | キャメルケース                   | `gameMode`, `calculateScore`  |
| 型名                           | パスカルケース、`I` プレフィ不要 | `GameMode`, `GameState`       |
| グローバル定数                 | UPPER_SNAKE_CASE                 | `MAX_SCORE`                   |
| ローカル定数                   | キャメルケース                   | `defaultStorageData`          |
| コンポーネント名               | パスカルケース、function 宣言    | `export function Button() {}` |

例外として、Next.js App Router のフレームワーク規約ファイル（`page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`, `not-found.tsx`, `loading.tsx`, `template.tsx`, `middleware.ts` など）はフレームワークの命名要件に従う。バレル `index.ts` は各 workspace パッケージの `exports` フィールドで公開境界を表すモジュールに限り許可する。

## 関数定義

- 通常の関数: `const` + アロー関数
- React コンポーネント: `function` 宣言

## 型定義

- 配列型: `number[]`（`Array<number>` 禁止）
- 型インポート: `import type { ... }` を使用
- `enum` 禁止 → オブジェクトマップ + `as const`
- `as const satisfies` で型チェック + 不変性を両立
- Literal Union 型を活用、`string` 型は避ける
- Props の型定義は `type`（`interface` 禁止）
- オプショナル: `?` 演算子。`undefined` と `null` の混在禁止

## イミュータブル操作

- 配列: `toSorted()`, `toReversed()`, `toSpliced()`
- オブジェクト: スプレッド構文
- ミューテーション禁止: `sort()`, `reverse()`, `push()`, 直接代入

## 制御構文

- 早期リターン（else 句を避ける）
- 配列アクセス: `Array.at()`（ブラケット `[]` 禁止）
- Literal Union 型の分岐: オブジェクトマップ（if-else チェーン禁止）
- 三項演算子のネスト禁止

## Async/Await

- `async/await` を使用（Promise チェーン禁止）
- Floating Promises: `void` 演算子で意図的に無視するか `await`

## 禁止事項

`any` / `var` / `enum` / ミューテーション / デフォルトエクスポート（コンポーネント以外） / 通常関数の `function` 宣言

## ディレクトリ配置

各 feature パッケージ（`packages/<feature>/`、`feature-admin` を含む）は以下の構造:

| ディレクトリ  | 用途                             |
| ------------- | -------------------------------- |
| `actions/`    | Server Actions                   |
| `components/` | React コンポーネント             |
| `queries/`    | データ取得関数                   |
| `schemas/`    | Zod スキーマ（複数ファイル）     |
| `hooks/`      | カスタムフック（必要時）         |
| `providers/`  | コンテキストプロバイダ（必要時） |

- スキーマ: `packages/<feature>/schemas/<schemaName>.ts` に配置
- export名は**定義側のコンテキスト**を反映した具体的な名前にする
