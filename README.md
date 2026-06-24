# はいはい！ベビーラン（baby-crawling-game）

赤ちゃんがはいはいで進む距離（m）を競う、縦スクロール型の癒し系無限ランナー。
左右に動いて障害物を避け、おもちゃで遊んだり哺乳瓶・オムツで体力／不快度を
管理しながら、どこまで進めるかに挑戦する。

仕様は `design_handoff_baby_crawl/`（Claude Code Design の引き継ぎ資料）を正とし、
その挙動・数値・絵本トーンを TypeScript + React + Vite で再実装したもの。

## 技術スタック

- TypeScript / React 19 / Vite 8
- Vitest（テスト）/ Testing Library
- Tailwind CSS v4
- 画像・音声アセットはゼロ（インライン SVG ＋ Web Audio 合成）

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
呼び出して `ref` 上の状態を更新する。`step` は新しい状態と副作用イベント
（効果音・ゲームオーバー）を返し、副作用は呼び出し側で消費する。

```
src/
  constants/   論理キャンバス・既定バランス値・OBJECT_META
  types/       型定義
  game/        ゲームロジック（純粋関数。step/spawn/collision/movement…）
  utils/       clamp・色操作・localStorage
  audio/       Web Audio 合成
  components/   SVGスプライト・背景・HUD・演出・盤面・画面
  hooks/        入力・ゲームループ・演出時間
  App.tsx       画面遷移と統合
```

開発は TDD（テストファースト）で進め、ロジックは入力→出力で検証している。
