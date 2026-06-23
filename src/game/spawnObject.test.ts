import { afterEach, vi } from 'vitest';
import { spawnObject } from './spawnObject';
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
  it('カテゴリ抽選が障害物の範囲だと椅子を生成する', () => {
    // [カテゴリroll=0→obstacle, kind index=0→chair, lane=0]
    mockRandomSequence([0, 0, 0]);
    const object = spawnObject(7, DEFAULT_CONFIG);
    expect(object.kind).toBe('chair');
    expect(object.id).toBe(7);
  });

  it('カテゴリ抽選がアイテムの範囲かつ哺乳瓶の割合内だと哺乳瓶を生成する', () => {
    // [カテゴリroll=0.8→item, 哺乳瓶roll=0.5(<0.6)→bottle, lane=0.4→レーン2]
    mockRandomSequence([0.8, 0.5, 0.4]);
    const object = spawnObject(1, DEFAULT_CONFIG);
    expect(object.kind).toBe('bottle');
    expect(object.x).toBe(180);
  });

  it('哺乳瓶の割合を超えるとオムツを生成する', () => {
    // [item, 哺乳瓶roll=0.7(>=0.6)→diaper, lane=0]
    mockRandomSequence([0.8, 0.7, 0]);
    const object = spawnObject(1, DEFAULT_CONFIG);
    expect(object.kind).toBe('diaper');
  });

  it('生成位置は画面上端の外(y=-44)で未ヒット状態である', () => {
    mockRandomSequence([0, 0, 0]);
    const object = spawnObject(1, DEFAULT_CONFIG);
    expect(object.y).toBe(-44);
    expect(object.hit).toBe(false);
    expect(object.scale).toBe(1);
  });

  it('動的オブジェクト(ボール)には斜め移動の初速vxが付く', () => {
    // [カテゴリroll=0.5→toy, kind index=0→ball, lane=0, 方向roll=0→左(-1), 速度roll=0→0.28]
    mockRandomSequence([0.5, 0, 0, 0, 0]);
    const object = spawnObject(1, DEFAULT_CONFIG);
    expect(object.kind).toBe('ball');
    expect(object.vx).toBeCloseTo(-1 * DEFAULT_CONFIG.scrollSpeed * 0.28);
  });

  it('静的オブジェクトのvxは0である', () => {
    // [カテゴリroll=0.5→toy, kind index=0.4→teddy(index1), lane=0]
    mockRandomSequence([0.5, 0.4, 0]);
    const object = spawnObject(1, DEFAULT_CONFIG);
    expect(object.kind).toBe('teddy');
    expect(object.vx).toBe(0);
  });

  it('レーンは0〜4のいずれかの論理X座標に収まる', () => {
    mockRandomSequence([0, 0, 0.99]);
    const object = spawnObject(1, DEFAULT_CONFIG);
    expect(object.x).toBe(312);
  });
});
