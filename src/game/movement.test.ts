import { moveBaby, moveObjects } from './movement';
import { DEFAULT_CONFIG, STAGE_HEIGHT } from '../constants/gameConfig';
import type { GameObject, InputState } from '../types/game';

const noInput: InputState = {
  left: false,
  right: false,
  targetX: null,
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
    const babyX = moveBaby(180, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      right: true,
    });
    expect(babyX).toBeCloseTo(180 + DEFAULT_CONFIG.babyMoveSpeed * 0.1);
  });

  it('左キー押下で左へ動く', () => {
    const babyX = moveBaby(180, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      left: true,
    });
    expect(babyX).toBeCloseTo(180 - DEFAULT_CONFIG.babyMoveSpeed * 0.1);
  });

  it('左キーと右キーが同時なら動かない', () => {
    const babyX = moveBaby(180, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      left: true,
      right: true,
    });
    expect(babyX).toBe(180);
  });

  it('左端(48)を超えてはクランプされる', () => {
    const babyX = moveBaby(50, 0.5, DEFAULT_CONFIG, {
      ...noInput,
      left: true,
    });
    expect(babyX).toBe(48);
  });

  it('右端(312)を超えてはクランプされる', () => {
    const babyX = moveBaby(310, 0.5, DEFAULT_CONFIG, {
      ...noInput,
      right: true,
    });
    expect(babyX).toBe(312);
  });

  it('ポインタ目標(targetX)へ1フレーム最大 babyMoveSpeed×dt で追従する', () => {
    const babyX = moveBaby(180, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      targetX: 280,
    });
    expect(babyX).toBeCloseTo(180 + DEFAULT_CONFIG.babyMoveSpeed * 0.1);
  });

  it('ポインタ目標が近ければその位置で止まる', () => {
    const babyX = moveBaby(180, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      targetX: 185,
    });
    expect(babyX).toBeCloseTo(185);
  });

  it('タップ目標は離した後(キー入力なし)も複数フレームで目標へ収束する', () => {
    // タップで targetX=300 を設定。指を離してもキー入力が無い限り追従し続ける。
    let babyX = 180;
    const tapped: InputState = { ...noInput, targetX: 300 };
    for (let i = 0; i < 60; i += 1) {
      babyX = moveBaby(babyX, 1 / 60, DEFAULT_CONFIG, tapped);
    }
    expect(babyX).toBeCloseTo(300);
  });

  it('ポインタ目標がnullでキー入力もなければ動かない', () => {
    const babyX = moveBaby(180, 0.1, DEFAULT_CONFIG, noInput);
    expect(babyX).toBe(180);
  });

  it('キー入力はポインタ目標より優先される', () => {
    // targetX(左方向)が設定されていても右キーが優先され右へ動く
    const babyX = moveBaby(180, 0.1, DEFAULT_CONFIG, {
      left: false,
      right: true,
      targetX: 60,
    });
    expect(babyX).toBeCloseTo(180 + DEFAULT_CONFIG.babyMoveSpeed * 0.1);
  });
});

describe('moveObjects', () => {
  it('静的オブジェクトは scrollSpeed×dt 分だけ下降する', () => {
    const result = moveObjects(
      [makeObject({ kind: 'chair', y: 100 })],
      0.1,
      DEFAULT_CONFIG,
    );
    expect(result.at(0)?.y).toBeCloseTo(100 + DEFAULT_CONFIG.scrollSpeed * 0.1);
  });

  it('動的オブジェクト(ボール)は scrollSpeed×1.5 で下降する', () => {
    const result = moveObjects(
      [makeObject({ kind: 'ball', y: 100, vx: 0 })],
      0.1,
      DEFAULT_CONFIG,
    );
    expect(result.at(0)?.y).toBeCloseTo(
      100 + DEFAULT_CONFIG.scrollSpeed * 1.5 * 0.1,
    );
  });

  it('動的オブジェクトは vx×dt 分だけ横移動する', () => {
    const result = moveObjects(
      [makeObject({ kind: 'ball', x: 180, vx: 50 })],
      0.1,
      DEFAULT_CONFIG,
    );
    expect(result.at(0)?.x).toBeCloseTo(180 + 50 * 0.1);
  });

  it('左壁(x<26)で反射して vx が正に反転する', () => {
    const result = moveObjects(
      [makeObject({ kind: 'ball', x: 28, vx: -50 })],
      0.1,
      DEFAULT_CONFIG,
    );
    const obj = result.at(0);
    expect(obj?.x).toBe(26);
    expect(obj?.vx).toBeGreaterThan(0);
  });

  it('右壁(x>334)で反射して vx が負に反転する', () => {
    const result = moveObjects(
      [makeObject({ kind: 'ball', x: 332, vx: 50 })],
      0.1,
      DEFAULT_CONFIG,
    );
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
