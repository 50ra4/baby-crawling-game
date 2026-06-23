// ゲーム全体で使う型定義。手書き型は最小限にし、リテラルユニオンを活用する。

export type ObjectKind = 'chair' | 'ball' | 'teddy' | 'duck' | 'bottle' | 'diaper';

export type ObjectCategory = 'obstacle' | 'toy' | 'item';

export type GameScreen = 'title' | 'playing' | 'over';

export type ContactType = 'hurt' | 'play';

export type CrawlStyle = 'diagonal' | 'bunny' | 'wiggle';

export type HurtStyle = 'flash' | 'tumble' | 'squash';

export type PlayStyle = 'sit' | 'bounce' | 'spin';

export type Theme = 'room' | 'park' | 'night';

export type SfxName = 'bottle' | 'diaper' | 'obstacle' | 'toy' | 'start' | 'gameover';

export type ObjectMeta = {
  label: string;
  category: ObjectCategory;
  dynamic: boolean;
  base: number;
};

// 画面上に存在する1つのオブジェクト（障害物・おもちゃ・回復アイテム）
export type GameObject = {
  id: number;
  kind: ObjectKind;
  x: number;
  y: number;
  hit: boolean;
  scale: number;
  vx: number;
};

// 被弾時の接触フリーズ状態
export type Contact = {
  type: ContactType;
  t: number;
  dur: number;
};

// 数値演出（上昇フェードするテキスト）
export type Popup = {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
  t: number;
};

export type BestRecord = {
  dist: number;
  score: number;
};

// プレイヤー入力（毎フレーム参照される）
export type InputState = {
  left: boolean;
  right: boolean;
  dragging: boolean;
  targetX: number;
};

// ゲームバランスの調整値。本番では定数として固定する。
export type GameConfig = {
  scrollSpeed: number;
  babyMoveSpeed: number;
  spawnInterval: number;
  obstacleRate: number;
  toyRate: number;
  itemRate: number;
  bottleShare: number;
  staminaStart: number;
  drainPerSec: number;
  obstacleDamage: number;
  toyDamage: number;
  bottleHealPct: number;
  discomfortThreshold: number;
  drainMultiplier: number;
  invincibleTime: number;
  contactTime: number;
  crawlStyle: CrawlStyle;
  hurtStyle: HurtStyle;
  playStyle: PlayStyle;
  crawlCyclesPerSec: number;
  bounceHeight: number;
  shakeIntensity: number;
  shakeDuration: number;
  skin: string;
  cloth: string;
  theme: Theme;
  sfxOn: boolean;
  bgmOn: boolean;
  name: string;
};

// 毎フレームの可変なゲーム状態
export type GameState = {
  babyX: number;
  targetX: number;
  stamina: number;
  maxStamina: number;
  discomfort: number;
  distancePx: number;
  score: number;
  objects: GameObject[];
  nextId: number;
  spawnAcc: number;
  phase: number;
  contact: Contact | null;
  invincibleUntil: number;
  invincibleType: ContactType | null;
  shake: number;
  popups: Popup[];
  popId: number;
  elapsed: number;
  over: boolean;
};

// step が返す副作用イベント。呼び出し側が消費して音声再生・画面遷移を行う。
export type GameEvent =
  | { type: 'sfx'; name: SfxName }
  | { type: 'gameover'; dist: number; score: number };

export type StepResult = {
  state: GameState;
  events: GameEvent[];
};
