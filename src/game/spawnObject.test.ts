import { afterEach, vi } from 'vitest';
import { pickToyKind, spawnObject } from './spawnObject';
import { DEFAULT_CONFIG } from '../constants/gameConfig';

// Math.random の戻り値を順番に固定する
const mockRandomSequence = (values: number[]): void => {
  const spy = vi.spyOn(Math, 'random');
  values.forEach((value) => spy.mockReturnValueOnce(value));
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('spawnObject', () => {
  it('指定したkind(哺乳瓶)をそのまま生成する', () => {
    // [lane=0]
    mockRandomSequence([0]);
    const object = spawnObject(7, 'bottle', DEFAULT_CONFIG);
    expect(object.kind).toBe('bottle');
    expect(object.id).toBe(7);
  });

  it('指定したkind(オムツ)をそのまま生成する', () => {
    mockRandomSequence([0]);
    const object = spawnObject(1, 'diaper', DEFAULT_CONFIG);
    expect(object.kind).toBe('diaper');
  });

  it('生成位置は画面上端の外(y=-44)で未ヒット状態である', () => {
    mockRandomSequence([0]);
    const object = spawnObject(1, 'teddy', DEFAULT_CONFIG);
    expect(object.y).toBe(-44);
    expect(object.hit).toBe(false);
    expect(object.scale).toBe(1);
  });

  it('動的オブジェクト(ボール)には斜め移動の初速vxが付く', () => {
    // [lane=0, 方向roll=0→左(-1), 速度roll=0→0.28]
    mockRandomSequence([0, 0, 0]);
    const object = spawnObject(1, 'ball', DEFAULT_CONFIG);
    expect(object.vx).toBeCloseTo(-1 * DEFAULT_CONFIG.scrollSpeed * 0.28);
  });

  it('静的オブジェクトのvxは0である', () => {
    // [lane=0]
    mockRandomSequence([0]);
    const object = spawnObject(1, 'teddy', DEFAULT_CONFIG);
    expect(object.vx).toBe(0);
  });

  it('レーンは0〜4のいずれかの論理X座標に収まる', () => {
    // [lane=0.99→レーン4(x=312)]
    mockRandomSequence([0.99]);
    const object = spawnObject(1, 'bottle', DEFAULT_CONFIG);
    expect(object.x).toBe(312);
  });
});

describe('pickToyKind', () => {
  it('抽選値が先頭ならボールを返す', () => {
    mockRandomSequence([0]);
    expect(pickToyKind()).toBe('ball');
  });

  it('抽選値が中間ならテディベアを返す', () => {
    // index=Math.floor(0.4*3)=1→teddy
    mockRandomSequence([0.4]);
    expect(pickToyKind()).toBe('teddy');
  });

  it('抽選値が末尾ならアヒルを返す', () => {
    // index=Math.floor(0.99*3)=2→duck
    mockRandomSequence([0.99]);
    expect(pickToyKind()).toBe('duck');
  });
});
