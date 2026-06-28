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
  chair: { label: '椅子', category: 'obstacle', dynamic: false, base: 76 },
  ball: { label: 'ボール', category: 'toy', dynamic: true, base: 54 },
  teddy: { label: 'テディベア', category: 'toy', dynamic: false, base: 76 },
  duck: {
    label: 'アヒルのおもちゃ',
    category: 'toy',
    dynamic: false,
    base: 42,
  },
} as const satisfies Record<ObjectKind, ObjectMeta>;

// カテゴリごとのkind一覧。スポーン時の抽選に使う。
export const KINDS = {
  obstacle: ['chair'],
  toy: ['ball', 'teddy', 'duck'],
  item: ['bottle', 'diaper'],
} as const satisfies Record<ObjectCategory, ObjectKind[]>;

// ゲームバランスの既定値。README/SPEC_confirmed.md の推奨初期値（normalプリセット）。
export const DEFAULT_CONFIG: GameConfig = {
  scrollSpeed: 200,
  babyMoveSpeed: 293,
  babyAccel: 1500,
  spawnInterval: 0.75,
  obstacleRate: 45,
  toyRate: 30,
  itemRate: 25,
  bottleShare: 60,
  staminaStart: 100,
  drainPerSec: 2,
  obstacleDamage: 10,
  toyDamage: 10,
  bottleHealPct: 20,
  discomfortThreshold: 80,
  drainMultiplier: 2,
  invincibleTime: 1.0,
  contactTime: 0.6,
  crawlStyle: 'diagonal',
  hurtStyle: 'flash',
  playStyle: 'bounce',
  crawlCyclesPerSec: 2.2,
  bounceHeight: 3.5,
  shakeIntensity: 8,
  shakeDuration: 0.3,
  theme: 'room',
  sfxOn: true,
  bgmOn: false,
  name: '',
  gender: 'girl',
};
