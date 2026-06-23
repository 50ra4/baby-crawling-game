import {
  BABY_Y,
  DEFAULT_CONFIG,
  KINDS,
  LANES,
  MARGIN,
  OBJECT_META,
  PX_PER_M,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  laneX,
} from './gameConfig';
import type { ObjectCategory, ObjectKind } from '../types/game';

describe('論理キャンバス定数', () => {
  it('論理キャンバスが 360×680 である', () => {
    expect(STAGE_WIDTH).toBe(360);
    expect(STAGE_HEIGHT).toBe(680);
  });

  it('赤ちゃんの基準Y位置が画面高さの70%である', () => {
    expect(BABY_Y).toBe(680 * 0.7);
  });

  it('38pxが1メートルに換算される', () => {
    expect(PX_PER_M).toBe(38);
  });

  it('レーン数が5、左右マージンが48である', () => {
    expect(LANES).toBe(5);
    expect(MARGIN).toBe(48);
  });
});

describe('laneX', () => {
  it('左端レーン(0)が48、右端レーン(4)が312である', () => {
    expect(laneX(0)).toBe(48);
    expect(laneX(4)).toBe(312);
  });

  it('5レーンが等間隔(66px)に配置される', () => {
    expect(laneX(0)).toBe(48);
    expect(laneX(1)).toBe(114);
    expect(laneX(2)).toBe(180);
    expect(laneX(3)).toBe(246);
    expect(laneX(4)).toBe(312);
  });
});

describe('OBJECT_META', () => {
  it('6種類のオブジェクトが定義されている', () => {
    expect(Object.keys(OBJECT_META)).toHaveLength(6);
  });

  it('椅子は障害物・静的・大サイズ(76)である', () => {
    expect(OBJECT_META.chair.category).toBe('obstacle');
    expect(OBJECT_META.chair.dynamic).toBe(false);
    expect(OBJECT_META.chair.base).toBe(76);
  });

  it('ボールはおもちゃ・動的・中サイズ(54)である', () => {
    expect(OBJECT_META.ball.category).toBe('toy');
    expect(OBJECT_META.ball.dynamic).toBe(true);
    expect(OBJECT_META.ball.base).toBe(54);
  });

  it('哺乳瓶とオムツは回復アイテムである', () => {
    expect(OBJECT_META.bottle.category).toBe('item');
    expect(OBJECT_META.diaper.category).toBe('item');
  });

  it('動的オブジェクトはボールのみである', () => {
    const dynamicKinds = (Object.keys(OBJECT_META) as ObjectKind[]).filter(
      (kind) => OBJECT_META[kind].dynamic,
    );
    expect(dynamicKinds).toEqual(['ball']);
  });
});

describe('KINDS', () => {
  it('各カテゴリのkindがOBJECT_METAのカテゴリと整合する', () => {
    (Object.keys(KINDS) as ObjectCategory[]).forEach((category) => {
      KINDS[category].forEach((kind) => {
        expect(OBJECT_META[kind].category).toBe(category);
      });
    });
  });

  it('障害物は椅子のみ、回復アイテムは哺乳瓶とオムツである', () => {
    expect(KINDS.obstacle).toEqual(['chair']);
    expect(KINDS.item).toEqual(['bottle', 'diaper']);
  });
});

describe('DEFAULT_CONFIG', () => {
  it('スピードが仕様通り(スクロール200/横移動440)である', () => {
    expect(DEFAULT_CONFIG.scrollSpeed).toBe(200);
    expect(DEFAULT_CONFIG.babyMoveSpeed).toBe(440);
  });

  it('難易度がnormalプリセット(間隔0.75/障害物45/おもちゃ30/アイテム25)である', () => {
    expect(DEFAULT_CONFIG.spawnInterval).toBe(0.75);
    expect(DEFAULT_CONFIG.obstacleRate).toBe(45);
    expect(DEFAULT_CONFIG.toyRate).toBe(30);
    expect(DEFAULT_CONFIG.itemRate).toBe(25);
  });

  it('パラメータ挙動が仕様通りである', () => {
    expect(DEFAULT_CONFIG.staminaStart).toBe(100);
    expect(DEFAULT_CONFIG.obstacleDamage).toBe(10);
    expect(DEFAULT_CONFIG.toyDamage).toBe(10);
    expect(DEFAULT_CONFIG.bottleHealPct).toBe(20);
    expect(DEFAULT_CONFIG.discomfortThreshold).toBe(80);
    expect(DEFAULT_CONFIG.drainMultiplier).toBe(2);
    expect(DEFAULT_CONFIG.invincibleTime).toBe(1.0);
    expect(DEFAULT_CONFIG.contactTime).toBe(0.6);
  });

  it('アニメーション既定値(対角/点滅/跳ね)である', () => {
    expect(DEFAULT_CONFIG.crawlStyle).toBe('diagonal');
    expect(DEFAULT_CONFIG.hurtStyle).toBe('flash');
    expect(DEFAULT_CONFIG.playStyle).toBe('bounce');
  });

  it('見た目の既定値(肌・服・おへや)である', () => {
    expect(DEFAULT_CONFIG.skin).toBe('#ffd9bf');
    expect(DEFAULT_CONFIG.cloth).toBe('#ffb3c7');
    expect(DEFAULT_CONFIG.theme).toBe('room');
  });

  it('効果音はON、子守唄BGMはOFFである', () => {
    expect(DEFAULT_CONFIG.sfxOn).toBe(true);
    expect(DEFAULT_CONFIG.bgmOn).toBe(false);
  });
});
