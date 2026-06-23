// 値を [min, max] の範囲に収める
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));
