---
paths: ['**/*.tsx', '**/*.css']
---

# Tailwind CSS 規約

## バージョン

Tailwind CSS v4（`@tailwindcss/postcss` 経由）。`tailwind.config.js` は廃止済み。設定は `packages/web/app/globals.css` の `@theme` ブロックで管理する。

## 基本方針

- ユーティリティクラス優先。カスタム CSS は Tailwind で不可能な場合のみ
- インラインスタイル **禁止**（Tailwind で表現可能な場合）
  - 例外: `app/opengraph-image.tsx` / `app/icon.tsx` / `app/apple-icon.tsx` は Next.js `ImageResponse` API の制約上インラインスタイルを許容
- クラス順序: レイアウト → スペーシング → サイズ → 背景・ボーダー → テキスト → エフェクト → トランジション
- レスポンシブ: モバイルファースト（`md:` → `lg:`）
- ダークモード: **採用なし**（`dark:` プレフィックス使用禁止）

## カラートークン参照

デザイントークンは `globals.css` の `:root` + `@theme` ブロックで一元管理する。コンポーネントからは以下のいずれかで参照する。

```tsx
// @theme 定義のカスタムカラークラスを使用（推奨）
<div className="text-text bg-surface border-border" />

// CSS 変数の arbitrary value を使用（@theme 未定義のトークンや one-off の値）
<div className="text-[var(--priority)] shadow-[0_1px_3px_rgba(0,0,0,0.06)]" />
```

利用可能なカスタムカラークラス: `bg-bg` / `bg-surface` / `bg-primary` / `text-text` / `text-muted` / `text-primary` / `text-danger` / `text-link` / `border-border` 等（`globals.css` の `@theme` ブロックを参照）。

## @apply

繰り返しの多いパターンのみ使用可。原則としてユーティリティクラスを直接 className に記述することを優先する。

## 更新日

2026-06-01
