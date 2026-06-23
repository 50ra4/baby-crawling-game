---
paths: ['**/*.tsx']
---

# React コーディング規約

## コンポーネント設計

- **Pure Component（`components/`）**: 状態なし、副作用なし、`function` 宣言。`useState` 禁止
- **Feature Component（`packages/<feature>/`）**: カスタムフックでロジック分離、`function` 宣言
- **Page Component（`pages/`）**: 状態管理と子コンポーネントへの props 配布

## 再レンダリング防止

- オブジェクト・関数をインラインで props に渡さない
- 状態に依存しない値はモジュールレベル定数（UPPER_SNAKE_CASE）
- props なしコンポーネントは `React.memo`
- デフォルト値は分割代入で指定

## Hooks

- **useState**: 初期値で型推論。関数型更新 `setScore((prev) => prev + 1)`
- **useEffect**: 原則禁止。許容: 外部API同期、DOM操作、サブスクリプション（クリーンアップ必須）
  - 派生状態 → `useMemo` / イベント駆動 → ハンドラ / 初期化 → `useState(() => ...)`
- **useCallback**: 子コンポーネントに渡す関数に使用
- **useMemo**: 重い計算のメモ化のみ（単純な値の不要なメモ化禁止）
- **カスタムフック**: `use` プレフィックス、単一責任

## 条件付きレンダリング

- true のみ: `&&` / true/false 両方: 三項演算子 / 早期リターン
- 三項演算子 + null → `&&` を使う
- show prop で内部表示制御 → 呼び出し元で条件付きレンダー

## リスト

- 安定した key（一意ID優先、なければ複合キー）
- index key は並び替えがない場合のみ

## ルーティング

- 単純遷移: `<Link>` / `<ButtonLink>`
- 副作用あり遷移のみ: `useNavigate`

## セキュリティ

- `dangerouslySetInnerHTML` 禁止
- 外部リンク: `rel="noopener noreferrer"` 必須
