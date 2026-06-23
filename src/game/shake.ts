// 画面シェイク量(0..1)を減衰させる。duration秒で1から0へ。
export const nextShake = (shake: number, dt: number, duration: number): number =>
  Math.max(0, shake - dt / Math.max(0.05, duration));
