# はいはい！ベビーラン（baby-crawling-game）

赤ちゃんがはいはいで進む距離（m）を競う、縦スクロール型の癒し系無限ランナー。
左右に動いて障害物を避け、おもちゃで遊んだり哺乳瓶・オムツで体力／不快度を
管理しながら、どこまで進めるかに挑戦する。

仕様は `docs/specs/`（実装を正本として整理した仕様書群）にまとめている。

- [docs/specs/product.md](docs/specs/product.md)：プロダクト要件・ユーザーストーリー・用語集
- [docs/specs/tech.md](docs/specs/tech.md)：技術スタック・環境・契約要点
- [docs/specs/structure.md](docs/specs/structure.md)：構成・ユニット境界・依存関係
- [docs/specs/DESIGN.md](docs/specs/DESIGN.md)：UI/UX デザイン仕様

## 技術スタック

- TypeScript / React 19 / Vite 8
- Vitest（テスト）/ Testing Library
- Tailwind CSS v4
- 画像は PNG スプライト（`src/assets/sprites/`）、音声は外部ファイルを使わず Web Audio で合成

## 開発

```bash
npm install      # 依存インストール
npm run dev      # 開発サーバー
npm test         # テスト（watch）
npm run test:run # テスト（1回）
npm run build    # 本番ビルド（型チェック込み）
npm run lint     # ESLint
```

## 操作

- ← → / A D：左右移動（押している間だけ移動）
- ドラッグ（マウス／タッチ）：指の位置へ追従
- Space / Enter：開始・再開

## 設計

ゲームの物理は React に依存しない純粋関数（`src/game/`）として実装し、
`requestAnimationFrame` ループ（`src/hooks/useGameLoop.ts`）から毎フレーム
呼び出して `ref` 上の状態を更新する。`stepGame` は新しい状態と副作用イベント
（効果音・ゲームオーバー）を返し、副作用は呼び出し側で消費する。

```
src/
  constants/   論理キャンバス・既定バランス値・OBJECT_META
  types/       型定義
  game/        ゲームロジック（純粋関数。step/spawn/collision/movement…）
  utils/       clamp・色操作・localStorage
  audio/       Web Audio 合成
  components/   PNGスプライト・背景・HUD・演出・盤面・画面
  hooks/        入力・ゲームループ・演出時間
  App.tsx       画面遷移と統合
```

開発は TDD（テストファースト）で進め、ロジックは入力→出力で検証している。
