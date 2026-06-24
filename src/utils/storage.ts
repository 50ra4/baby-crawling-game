import type { BestRecord } from '../types/game';

const BEST_KEY = 'baby_crawl_best';
const NAME_KEY = 'baby_crawl_name';

const EMPTY_BEST: BestRecord = { dist: 0, score: 0 };

// ベスト距離を読み出す。未保存・破損時は初期値。
export const loadBest = (): BestRecord => {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (!raw) {
      return EMPTY_BEST;
    }
    const parsed = JSON.parse(raw) as Partial<BestRecord>;
    return {
      dist: typeof parsed.dist === 'number' ? parsed.dist : 0,
      score: typeof parsed.score === 'number' ? parsed.score : 0,
    };
  } catch {
    return EMPTY_BEST;
  }
};

export const saveBest = (best: BestRecord): void => {
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(best));
  } catch {
    // localStorage が使えない環境では永続化を諦める
  }
};

export const loadName = (): string => {
  try {
    return localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
};

export const saveName = (name: string): void => {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    // 同上
  }
};
