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

// 速度0から指定入力で frames フレーム回し、収束後の位置・速度を返す。
const runFrames = (
  startX: number,
  input: InputState,
  frames: number,
): { x: number; vx: number } => {
  let x = startX;
  let vx = 0;
  for (let i = 0; i < frames; i += 1) {
    ({ x, vx } = moveBaby(x, vx, 1 / 60, DEFAULT_CONFIG, input));
  }
  return { x, vx };
};

describe('moveBaby', () => {
  it('右キー押下は速度0から加速し、初フレームは最高速度に届かない(遊び)', () => {
    const { x, vx } = moveBaby(180, 0, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      right: true,
    });
    // 1フレームの加速量は babyAccel×dt
    expect(vx).toBeCloseTo(DEFAULT_CONFIG.babyAccel * 0.1);
    expect(x).toBeGreaterThan(180);
    // 即最高速度では動かない（急発進しない）
    expect(x).toBeLessThan(180 + DEFAULT_CONFIG.babyMoveSpeed * 0.1);
  });

  it('加速は babyMoveSpeed で頭打ちになる', () => {
    const { vx } = moveBaby(
      180,
      DEFAULT_CONFIG.babyMoveSpeed,
      0.1,
      DEFAULT_CONFIG,
      {
        ...noInput,
        right: true,
      },
    );
    expect(vx).toBeCloseTo(DEFAULT_CONFIG.babyMoveSpeed);
  });

  it('入力を離すと慣性で減速し、即停止しない', () => {
    const { vx } = moveBaby(
      200,
      DEFAULT_CONFIG.babyMoveSpeed,
      0.05,
      DEFAULT_CONFIG,
      noInput,
    );
    expect(vx).toBeGreaterThan(0);
    expect(vx).toBeLessThan(DEFAULT_CONFIG.babyMoveSpeed);
  });

  it('入力を離して減速し続ければ停止する', () => {
    let x = 200;
    let vx = DEFAULT_CONFIG.babyMoveSpeed;
    for (let i = 0; i < 60; i += 1) {
      ({ x, vx } = moveBaby(x, vx, 1 / 60, DEFAULT_CONFIG, noInput));
    }
    expect(vx).toBeCloseTo(0);
  });

  it('左キーと右キーが同時なら目標速度0で動かない', () => {
    const { x, vx } = moveBaby(180, 0, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      left: true,
      right: true,
    });
    expect(x).toBe(180);
    expect(vx).toBe(0);
  });

  it('左端(48)でクランプされ、速度が0になる', () => {
    const { x, vx } = moveBaby(50, 0, 0.5, DEFAULT_CONFIG, {
      ...noInput,
      left: true,
    });
    expect(x).toBe(48);
    expect(vx).toBe(0);
  });

  it('右端(312)でクランプされ、速度が0になる', () => {
    const { x, vx } = moveBaby(310, 0, 0.5, DEFAULT_CONFIG, {
      ...noInput,
      right: true,
    });
    expect(x).toBe(312);
    expect(vx).toBe(0);
  });

  it('ポインタ目標(targetX)へ向けて加速する', () => {
    const { x, vx } = moveBaby(180, 0, 0.1, DEFAULT_CONFIG, {
      ...noInput,
      targetX: 280,
    });
    expect(vx).toBeGreaterThan(0);
    expect(x).toBeGreaterThan(180);
  });

  it('タップ目標は離した後(キー入力なし)も複数フレームで目標へ収束する', () => {
    const { x } = runFrames(180, { ...noInput, targetX: 300 }, 300);
    expect(Math.abs(x - 300)).toBeLessThan(1);
  });

  it('ポインタ目標が近ければ行き過ぎずその位置で止まる', () => {
    const { x } = runFrames(180, { ...noInput, targetX: 185 }, 120);
    expect(Math.abs(x - 185)).toBeLessThan(1);
  });

  it('最高速度で移動中に現在地をタップしても目標を行き過ぎず止まる', () => {
    // 右キーを離した直後の残存速度で現在地(180)をタップ。残存速度を打ち消し、
    // 目標を通り過ぎてから戻る挙動にならないこと（行き過ぎ防止）。
    let x = 180;
    let vx = DEFAULT_CONFIG.babyMoveSpeed;
    let maxX = x;
    for (let i = 0; i < 60; i += 1) {
      ({ x, vx } = moveBaby(x, vx, 1 / 60, DEFAULT_CONFIG, {
        ...noInput,
        targetX: 180,
      }));
      maxX = Math.max(maxX, x);
    }
    expect(maxX).toBeLessThanOrEqual(180 + 0.5);
    expect(Math.abs(x - 180)).toBeLessThan(1);
  });

  it('残存速度と逆向きの近いタップ目標でも大きく行き過ぎない', () => {
    // 右へ最高速度で移動中に、わずかに左(170)をタップ。右へ通り過ぎないこと。
    let x = 180;
    let vx = DEFAULT_CONFIG.babyMoveSpeed;
    let maxX = x;
    for (let i = 0; i < 120; i += 1) {
      ({ x, vx } = moveBaby(x, vx, 1 / 60, DEFAULT_CONFIG, {
        ...noInput,
        targetX: 170,
      }));
      maxX = Math.max(maxX, x);
    }
    expect(maxX).toBeLessThanOrEqual(180 + 0.5);
    expect(Math.abs(x - 170)).toBeLessThan(1);
  });

  it('入力がなく速度0なら動かない', () => {
    const { x, vx } = moveBaby(180, 0, 0.1, DEFAULT_CONFIG, noInput);
    expect(x).toBe(180);
    expect(vx).toBe(0);
  });

  it('キー入力はポインタ目標より優先される', () => {
    // targetX(左方向)が設定されていても右キーが優先され右へ加速する
    const { x, vx } = moveBaby(180, 0, 0.1, DEFAULT_CONFIG, {
      left: false,
      right: true,
      targetX: 60,
    });
    expect(vx).toBeGreaterThan(0);
    expect(x).toBeGreaterThan(180);
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
