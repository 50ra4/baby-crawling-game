import { mixColor } from '../../utils/color';

// 体力ゲージの色。残量で赤→橙→暗赤に切り替わる。
export const staminaColor = (ratio: number): string => {
  if (ratio > 0.5) {
    return '#ff6b81';
  }
  if (ratio > 0.25) {
    return '#ff9f43';
  }
  return '#a4313f';
};

// 不快度ゲージの色。0%→100% でミント色から深緑へ補間。
export const discomfortColor = (ratio: number): string =>
  mixColor('#9ad6c0', '#3a5a4a', ratio);
