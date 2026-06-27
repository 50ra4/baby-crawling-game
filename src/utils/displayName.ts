import type { Gender } from '../types/game';

// 名前未設定時のフォールバック表示名
const FALLBACK_NAME = 'あかちゃん';

// 性別ごとの敬称（リテラルユニオン分岐はオブジェクトマップで表現する）
const HONORIFIC = {
  boy: 'くん',
  girl: 'ちゃん',
} as const satisfies Record<Gender, string>;

// 表示名を組み立てる。名前が空/空白なら「あかちゃん」、それ以外は性別の敬称を付与する。
export const displayName = (name: string, gender: Gender): string => {
  const trimmed = name.trim();
  if (trimmed === '') {
    return FALLBACK_NAME;
  }
  return `${trimmed}${HONORIFIC[gender]}`;
};
