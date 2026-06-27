import { afterEach, beforeEach } from 'vitest';
import {
  loadBest,
  loadGender,
  loadName,
  saveBest,
  saveGender,
  saveName,
} from './storage';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe('loadBest / saveBest', () => {
  it('保存したベスト記録を読み出せる', () => {
    saveBest({ dist: 42, score: 42 });
    expect(loadBest()).toEqual({ dist: 42, score: 42 });
  });

  it('未保存なら距離0・スコア0を返す', () => {
    expect(loadBest()).toEqual({ dist: 0, score: 0 });
  });

  it('壊れたJSONが保存されていても初期値を返す', () => {
    localStorage.setItem('baby_crawl_best', '{壊れた');
    expect(loadBest()).toEqual({ dist: 0, score: 0 });
  });
});

describe('loadName / saveName', () => {
  it('保存した名前を読み出せる', () => {
    saveName('たろう');
    expect(loadName()).toBe('たろう');
  });

  it('未保存なら空文字を返す', () => {
    expect(loadName()).toBe('');
  });
});

describe('loadGender / saveGender', () => {
  it('保存した性別を読み出せる', () => {
    saveGender('boy');
    expect(loadGender()).toBe('boy');
  });

  it('未保存なら既定の女の子(girl)を返す', () => {
    expect(loadGender()).toBe('girl');
  });

  it('不正な値が保存されていても既定の女の子(girl)を返す', () => {
    localStorage.setItem('baby_crawl_gender', 'unknown');
    expect(loadGender()).toBe('girl');
  });
});
