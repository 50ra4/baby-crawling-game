import type {
  GameConfig,
  GameEvent,
  GameState,
  Popup,
  StepResult,
} from '../types/game';
import { BABY_Y, OBJECT_META } from '../constants/gameConfig';
import { addPopup } from './popups';

// ポップテキストの色（仕様のポップ色）
const POP_COLOR = {
  heal: '#37b24d',
  diaper: '#2f86d6',
  play: '#e88b1a',
} as const;

// 衝突判定の許容幅（赤ちゃんの当たり判定マージン）
const HIT_MARGIN_X = 24;
const HIT_MARGIN_Y = 26;
const RADIUS_FACTOR = 0.42;

// 全オブジェクトとの衝突を判定し、回復・被弾の効果を適用する。
// 状態を直接共有せず、新しい状態と発火イベントを返す。
export const checkCollisions = (
  state: GameState,
  config: GameConfig,
): StepResult => {
  const events: GameEvent[] = [];
  let stamina = state.stamina;
  let discomfort = state.discomfort;
  let contact = state.contact;
  let invincibleUntil = state.invincibleUntil;
  let popId = state.popId;
  let popups: Popup[] = state.popups;

  const objects = state.objects.map((object) => {
    if (object.hit) {
      return object;
    }
    const meta = OBJECT_META[object.kind];
    const radius = meta.base * object.scale * RADIUS_FACTOR;
    const dx = Math.abs(object.x - state.babyX);
    const dy = Math.abs(object.y - BABY_Y);
    const colliding = dx < radius + HIT_MARGIN_X && dy < radius + HIT_MARGIN_Y;
    if (!colliding) {
      return object;
    }

    // 回復アイテムは無敵に関係なく即時取得
    if (meta.category === 'item') {
      if (object.kind === 'bottle') {
        stamina = Math.min(
          state.maxStamina,
          stamina + state.maxStamina * (config.bottleHealPct / 100),
        );
        popups = addPopup(
          popups,
          popId++,
          '+体力',
          POP_COLOR.heal,
          object.x,
          object.y,
        );
        events.push({ type: 'sfx', name: 'bottle' });
      } else {
        discomfort = 0;
        popups = addPopup(
          popups,
          popId++,
          'おむつ交換！',
          POP_COLOR.diaper,
          object.x,
          object.y,
        );
        events.push({ type: 'sfx', name: 'diaper' });
      }
      return { ...object, hit: true };
    }

    // おもちゃは無敵時間中なら無視
    if (state.elapsed <= invincibleUntil) {
      return object;
    }

    invincibleUntil = state.elapsed + config.invincibleTime;
    stamina -= config.toyDamage;
    contact = { type: 'play', t: 0, dur: config.contactTime };
    popups = addPopup(
      popups,
      popId++,
      '遊んじゃった！',
      POP_COLOR.play,
      object.x,
      object.y,
    );
    events.push({ type: 'sfx', name: 'toy' });
    return { ...object, hit: true };
  });

  return {
    state: {
      ...state,
      stamina,
      discomfort,
      contact,
      invincibleUntil,
      popups,
      popId,
      objects,
    },
    events,
  };
};
