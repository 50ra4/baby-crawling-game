// 16進カラーから [r, g, b] を取り出す。3桁短縮形にも対応。
const toRgb = (hex: string): [number, number, number] => {
  const body = hex.replace('#', '');
  const full =
    body.length === 3
      ? body.replace(/./g, (channel) => channel + channel)
      : body;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
};

const toHex = (channels: [number, number, number]): string =>
  `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;

// 色を明暗方向にシフトする。amt が正で明るく、負で暗くなる。
export const shade = (hex: string, amt: number): string => {
  const shifted = toRgb(hex).map((channel) =>
    Math.max(0, Math.min(255, Math.round(channel + 255 * amt))),
  );
  return toHex(shifted as [number, number, number]);
};

// 2色をチャンネルごとに線形補間する。ratio 0 で a、1 で b。
export const mixColor = (a: string, b: string, ratio: number): string => {
  const ca = toRgb(a);
  const cb = toRgb(b);
  const mixed = ca.map((channel, i) =>
    Math.round(channel + (cb.at(i)! - channel) * ratio),
  );
  return toHex(mixed as [number, number, number]);
};
