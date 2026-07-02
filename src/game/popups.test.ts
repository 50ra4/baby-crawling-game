import { addPopup, updatePopups } from './popups';
import type { Popup } from '../types/game';

const makePopup = (overrides: Partial<Popup> = {}): Popup => ({
  id: 1,
  text: '+体力',
  color: '#37b24d',
  x: 100,
  y: 200,
  t: 0,
  ...overrides,
});

describe('updatePopups', () => {
  it('各ポップアップの経過時間が dt 分進む', () => {
    const result = updatePopups([makePopup({ t: 0 })], 0.1);
    expect(result.at(0)?.t).toBeCloseTo(0.1);
  });

  it('寿命(1.1秒)に達したポップアップは除去される', () => {
    const result = updatePopups([makePopup({ t: 1.05 })], 0.1);
    expect(result).toHaveLength(0);
  });

  it('寿命未満のポップアップは残る', () => {
    const result = updatePopups([makePopup({ t: 0.5 })], 0.1);
    expect(result).toHaveLength(1);
  });
});

describe('addPopup', () => {
  it('新しいポップアップを末尾に追加する', () => {
    const result = addPopup([], 5, '遊んじゃった！', '#e88b1a', 50, 60);
    expect(result).toHaveLength(1);
    expect(result.at(0)).toMatchObject({
      id: 5,
      text: '遊んじゃった！',
      color: '#e88b1a',
      x: 50,
      y: 60,
      t: 0,
    });
  });

  it('既存のポップアップを変更しない（不変）', () => {
    const existing = [makePopup()];
    const result = addPopup(existing, 2, 'わーい', '#fff', 0, 0);
    expect(existing).toHaveLength(1);
    expect(result).toHaveLength(2);
  });
});
