import { moveBaby, moveObjects } from './movement';
import { DEFAULT_CONFIG, STAGE_HEIGHT } from '../constants/gameConfig';
import type { GameObject, InputState } from '../types/game';

const noInput: InputState = {
  left: false,
  right: false,
  dragging: false,
  targetX: 180,
};

const makeObject = (overrides: Partial<GameObject> = {}): GameObject => ({
  id: 1,
  kind: 'chair',
  x: 180,
  y: 100,
  hit: false,
  scale: 1,
  vx: 0,
  ...overrides,
});

describe('moveBaby', () => {
  it('右キー押下で babyMoveSpeed×dt 分だけ右へ動く', () => {
    const result = moveBaby(180, 180, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      right: true,
    });
    expect(result.babyX).toBeCloseTo(180 + DEFAULT_CONFIG.babyMoveSpeed * 0.1);
    expect(result.targetX).toBe(result.babyX);
  });

  it('左キー押下で左へ動く', () => {
    const result = moveBaby(180, 180, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      left: true,
    });
    expect(result.babyX).toBeCloseTo(180 - DEFAULT_CONFIG.babyMoveSpeed * 0.1);
  });

  it('左キーと右キーが同時なら動かない', () => {
    const result = moveBaby(180, 180, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      left: true,
      right: true,
    });
    expect(result.babyX).toBe(180);
  });

  it('左端(48)を超えてはクランプされる', () => {
    const result = moveBaby(50, 50, 0.5, DEFAULT_CONFIG, {
      ...noInput,
      left: true,
    });
    expect(result.babyX).toBe(48);
  });

  it('右端(312)を超えてはクランプされる', () => {
    const result = moveBaby(310, 310, 0.5, DEFAULT_CONFIG, {
      ...noInput,
      right: true,
    });
    expect(result.babyX).toBe(312);
  });

  it('ドラッグ中はtargetXへ1フレーム最大 babyMoveSpeed×dt で追従する', () => {
    const result = moveBaby(180, 280, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      dragging: true,
      targetX: 280,
    });
    expect(result.babyX).toBeCloseTo(180 + DEFAULT_CONFIG.babyMoveSpeed * 0.1);
  });

  it('ドラッグ先が近ければその位置で止まる', () => {
    const result = moveBaby(180, 185, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      dragging: true,
      targetX: 185,
    });
    expect(result.babyX).toBeCloseTo(185);
  });

  it('入力がなければ動かない', () => {
    const result = moveBaby(180, 180, 0.1, DEFAULT_CONFIG, noInput);
    expect(result.babyX).toBe(180);
  });
});

describe('moveObjects', () => {
  it('静的オブジェクトは scrollSpeed×dt 分だけ下降する', () => {
    const result = moveObjects([makeObject({ kind: 'chair', y: 100 })], 0.1, DEFAULT_CONFIG);
    expect(result.at(0)?.y).toBeCloseTo(100 + DEFAULT_CONFIG.scrollSpeed * 0.1);
  });

  it('動的オブジェクト(ボール)は scrollSpeed×1.5 で下降する', () => {
    const result = moveObjects([makeObject({ kind: 'ball', y: 100, vx: 0 })], 0.1, DEFAULT_CONFIG);
    expect(result.at(0)?.y).toBeCloseTo(100 + DEFAULT_CONFIG.scrollSpeed * 1.5 * 0.1);
  });

  it('動的オブジェクトは vx×dt 分だけ横移動する', () => {
    const result = moveObjects([makeObject({ kind: 'ball', x: 180, vx: 50 })], 0.1, DEFAULT_CONFIG);
    expect(result.at(0)?.x).toBeCloseTo(180 + 50 * 0.1);
  });

  it('左壁(x<26)で反射して vx が正に反転する', () => {
    const result = moveObjects([makeObject({ kind: 'ball', x: 28, vx: -50 })], 0.1, DEFAULT_CONFIG);
    const obj = result.at(0);
    expect(obj?.x).toBe(26);
    expect(obj?.vx).toBeGreaterThan(0);
  });

  it('右壁(x>334)で反射して vx が負に反転する', () => {
    const result = moveObjects([makeObject({ kind: 'ball', x: 332, vx: 50 })], 0.1, DEFAULT_CONFIG);
    const obj = result.at(0);
    expect(obj?.x).toBe(334);
    expect(obj?.vx).toBeLessThan(0);
  });

  it('画面下端を大きく超えた(y>H+80)オブジェクトは除去される', () => {
    const result = moveObjects(
      [makeObject({ y: STAGE_HEIGHT + 100 })],
      0.1,
      DEFAULT_CONFIG,
    );
    expect(result).toHaveLength(0);
  });
});
