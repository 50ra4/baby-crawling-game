import type {
  GameConfig,
  ObjectCategory,
  ObjectKind,
  ObjectMeta,
} from '../types/game';

// 論理キャンバス（9:17 縦長ポートレート）。全座標はこの空間で計算する。
export const STAGE_WIDTH = 360;
export const STAGE_HEIGHT = 680;

// 赤ちゃんの基準Y位置と横幅
export const BABY_Y = STAGE_HEIGHT * 0.7;
export const BABY_WIDTH = 96;

// スクロール量の換算（38px = 1m）
export const PX_PER_M = 38;

// レーン構成
export const LANES = 5;
export const MARGIN = 48;

// レーン番号(0..4)を論理X座標に変換する
export const laneX = (lane: number): number =>
  MARGIN + (lane * (STAGE_WIDTH - 2 * MARGIN)) / (LANES - 1);

// オブジェクトのメタ情報。base はスプライトの基準サイズ(px)で、大/中/小の3クラス。
export const OBJECT_META = {
  bottle: { label: '哺乳瓶', category: 'item', dynamic: false, base: 54 },
  diaper: { label: 'オムツ', category: 'item', dynamic: false, base: 54 },
  ball: { label: 'ボール', category: 'toy', dynamic: true, base: 54 },
  teddy: { label: 'テディベア', category: 'toy', dynamic: false, base: 76 },
  duck: {
    label: 'アヒルのおもちゃ',
    category: 'toy',
    dynamic: false,
    base: 42,
  },
} as const satisfies Record<ObjectKind, ObjectMeta>;

// カテゴリごとのkind一覧。おもちゃはスポーン時の抽選に使う。
export const KINDS = {
  toy: ['ball', 'teddy', 'duck'],
  item: ['bottle', 'diaper'],
} as const satisfies Record<ObjectCategory, ObjectKind[]>;

// ゲームバランスの既定値。README/SPEC_confirmed.md の推奨初期値（normalプリセット）。
export const DEFAULT_CONFIG: GameConfig = {
  scrollSpeed: 200,
  babyMoveSpeed: 293,
  babyAccel: 1500,
  // おもちゃは唯一の接触ハザード。椅子廃止分を補い ~0.83体/s の頻度にする。
  toyInterval: 1.2,
  // 哺乳瓶は確実に供給し RNG 枯渇による理不尽を防ぐ（+20%回復を約4.5秒ごと）。
  bottleInterval: 4.5,
  // オムツは約7秒ごと。逃すと不快度が溜まる緊張感を残す。
  diaperInterval: 7.0,
  staminaStart: 100,
  drainPerSec: 2,
  toyDamage: 8,
  bottleHealPct: 20,
  discomfortThreshold: 80,
  drainMultiplier: 2,
  invincibleTime: 1.0,
  contactTime: 0.6,
  crawlStyle: 'diagonal',
  playStyle: 'bounce',
  crawlCyclesPerSec: 2.2,
  bounceHeight: 3.5,
  theme: 'room',
  sfxOn: true,
  bgmOn: false,
  name: '',
  gender: 'girl',
};
