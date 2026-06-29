# 構成仕様（structure）

> プロジェクト構成・ユニット境界・依存関係。本書は**実装を正本**とする。
> 関連: [product.md](./product.md) / [tech.md](./tech.md) / [DESIGN.md](./DESIGN.md)

## 1. プロジェクト形態

**単一パッケージ**の React + Vite SPA（モノレポではない）。
`workspaces` / `pnpm-workspace.yaml` / `turbo.json` / `lerna.json` はいずれも存在しない。

> 補足: `.claude/rules/*` のコーディング規約は monorepo / Next.js を前提とした汎用テンプレートで、
> 本リポジトリの実態（単一 Vite SPA）とは一部食い違う。規約の意図（TypeScript/React/Tailwind の
> 書き方）は適用しつつ、構成の正本は本書とする。

## 2. ディレクトリ構成

```
baby-crawling-game/
├── index.html                  # Vite エントリ HTML
├── package.json / tsconfig*.json / vite.config.ts / eslint.config.js / .prettierrc / .nvmrc
├── .github/workflows/          # ci.yml / deploy.yml
├── docs/specs/                 # 本仕様書群（product / tech / structure / DESIGN）
├── public/                     # favicon・apple-touch-icon・og-image
└── src/
    ├── main.tsx                # ReactDOM レンダリング
    ├── App.tsx                 # ルート：画面状態・設定・ループ駆動・イベント消費
    ├── globals.css             # Tailwind v4 @theme トークン＋全 UI スタイル
    ├── types/game.ts           # 全体の型定義（リテラルユニオン中心）
    ├── constants/gameConfig.ts # 論理寸法・OBJECT_META・KINDS・DEFAULT_CONFIG
    ├── game/                   # ゲームロジック（純粋関数。各 .test.ts 同梱）
    ├── components/             # 描画コンポーネント（stateless）
    ├── hooks/                  # カスタムフック（ループ・入力・時間・モーダル）
    ├── audio/gameAudio.ts      # Web Audio 合成シングルトン
    ├── utils/                  # math / color / storage / displayName（各 .test.ts）
    ├── assets/sprites/         # PNG スプライト（10 枚）
    └── test/setup.ts           # Vitest セットアップ
```

## 3. ユニット境界と役割

| ユニット       | パス                          | 役割                                                            | 依存方針                                |
| -------------- | ----------------------------- | --------------------------------------------------------------- | --------------------------------------- |
| 型定義         | `src/types/game.ts`           | 全体の共通型。リテラルユニオンで分岐の網羅性を担保              | 独立（他に依存しない基盤）              |
| 定数           | `src/constants/gameConfig.ts` | 論理寸法・`laneX`・`OBJECT_META`・`KINDS`・`DEFAULT_CONFIG`     | `types` のみ                            |
| ゲームロジック | `src/game/`                   | 純粋関数で物理・判定を計算。React 非依存・副作用なし            | `types`・`constants`・`utils`           |
| フック         | `src/hooks/`                  | rAF ループ・入力集約・時間・モーダル。React 依存の橋渡し        | `game`・`types`・`constants`・`utils`   |
| コンポーネント | `src/components/`             | stateless 描画（Pure Component）。状態は持たず props を描く     | `types`・`constants`・`utils`・`assets` |
| オーディオ     | `src/audio/`                  | 効果音・BGM 合成のシングルトン                                  | `types`                                 |
| ユーティリティ | `src/utils/`                  | `math`（clamp/lerp）・`color`（補間）・`storage`・`displayName` | 最小限・独立寄り                        |
| ルート         | `src/App.tsx`                 | 状態管理の集約点。画面遷移・設定・ループ駆動・イベント消費      | ほぼ全ユニット                          |

**ユニット境界の原則**:

- ゲーム物理は `src/game/` の純粋関数に閉じ込め、React に依存させない（テスト容易・移植容易）。
- コンポーネントは状態・副作用を持たず、状態は `App.tsx` に集約する。
- 副作用（音・遷移）はロジックがイベントとして返し、`App` だけが実行する（[tech.md](./tech.md) §5）。
- 入力は `ref` 経由で渡し、毎フレームの再レンダリングを避ける。

## 4. `src/game/` の内訳

| ファイル             | 責務                                                             |
| -------------------- | ---------------------------------------------------------------- |
| `gameStep.ts`        | 1 フレーム更新の統合（`stepGame`）。各サブモジュールを順に呼ぶ   |
| `createGameState.ts` | 初期 `GameState` 生成                                            |
| `contact.ts`         | 接触フリーズ状態の進行・解除                                     |
| `movement.ts`        | 赤ちゃん横移動（加減速イージング）・オブジェクト移動と画面外除去 |
| `stamina.ts`         | 体力消費・不快度上昇（時間ベース、消費倍率判定）                 |
| `spawnObject.ts`     | カテゴリ/種別/レーン抽選とオブジェクト生成                       |
| `collision.ts`       | 当たり判定と回復・被弾効果の適用、副作用イベント生成             |
| `shake.ts`           | シェイク量の減衰                                                 |
| `popups.ts`          | ポップテキストの追加・寿命更新                                   |

各ファイルに `*.test.ts` を同梱。総合シナリオは `gameSimulation.test.ts`。

## 5. 依存フロー

```
main.tsx
  └─ App.tsx ──┬─ useInput ─────────────▶ InputState(ref)
               ├─ useGameLoop ─ stepGame ─┬─ contact
               │                          ├─ movement
               │                          ├─ stamina
               │                          ├─ spawnObject
               │                          ├─ collision ─▶ GameEvent[]
               │                          ├─ shake
               │                          └─ popups
               ├─ handleEvents ─▶ gameAudio / saveBest / setScreen
               ├─ Stage ─ Playfield ─ {backgrounds, sprites, Hud, PopupText, ContactBurst}
               ├─ TitleScreen ─ HelpDialog
               └─ GameOverScreen

types/game.ts        … 全ユニットの共通型基盤
constants/gameConfig … 物理定数・メタデータの共通参照
```

データは「ロジック（`game/`）→ ループ（`hooks/`）→ ルート（`App`）→ 描画（`components/`）」の一方向。
逆方向の依存（コンポーネント → ロジック内部状態）は持たない。
