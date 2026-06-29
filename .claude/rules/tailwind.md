---
paths: ['**/*.tsx', '**/*.css']
---

# Tailwind CSS 規約

## バージョン

Tailwind CSS v4（`@tailwindcss/vite` プラグイン経由、`vite.config.ts` に登録）。`tailwind.config.js` は不使用。設定・トークンは `src/globals.css` の `@theme` ブロックで管理する。`src/globals.css` は `src/main.tsx` で読み込む。

## 基本方針

- ユーティリティクラス優先。レイアウト・間隔・サイズ・単純なタイポは className に直接ユーティリティを書く
- カスタム CSS（`@layer components`）に残してよいのは次のいずれかのみ:
  1. テストが参照するクラス名（セレクタ用フック）
  2. 反復する複雑装飾（多重 box-shadow / text-shadow / グラデーション / backdrop-filter）
  3. 子孫セレクタを持つタイポグラフィ（要素ごとのユーティリティ化が冗長になるもの）
- インラインスタイル **禁止**（Tailwind で表現可能な場合）
  - 例外: 値が実行時に決まる動的スタイル（座標・幅・スクロール量・動的グラデーション等）は `style` で渡してよい
- クラス順序: prettier-plugin-tailwindcss に一任（自動ソート）
- レスポンシブ: モバイルファースト（`md:` → `lg:`）
- ダークモード: **採用なし**（`dark:` プレフィックス使用禁止）

## globals.css の構成

`@import 'tailwindcss'` → `@theme`（トークン）→ `@layer base`（リセット・`body` 背景）→ `@layer components`（上記の残してよいクラスのみ）→ `@keyframes`。

## カラー・フォントトークン参照

トークンは `src/globals.css` の `@theme` ブロックで一元管理する。コンポーネントからは以下のいずれかで参照する。

```tsx
// @theme 定義のカスタムユーティリティを使用（推奨）
<div className="text-primary border-border-pink font-latin" />

// CSS 変数 / arbitrary value（@theme 未定義の one-off 値）
<div className="text-[#a98] shadow-[0_1px_3px_rgba(0,0,0,0.12)]" />
```

利用可能なカスタムユーティリティ（`@theme` 由来）:

- カラー: `text-ink` / `text-primary` / `text-primary-light` / `text-primary-deep` / `text-badge`、
  および対応する `bg-*` / `border-*`（例: `border-border-pink`）
- フォント: `font-jp` / `font-latin`

`@layer components` 内のカスタムクラスからは `var(--color-primary)` などで参照する。

## @apply

原則使用しない。反復する複雑装飾は素の CSS で `@layer components` に記述する（本プロジェクトでは `@apply` 不使用）。

## 更新日

2026-06-29
