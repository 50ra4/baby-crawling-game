// 画像1枚を読み込む。壊れた画像で永久ブロックしないよう、onload/onerror どちらでも resolve する（fail-open）。
const preloadImage = (url: string): Promise<void> =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = url;
  });

// ゲーム開始前に全スプライト画像を読み込み切るためのユーティリティ。
export const preloadImages = async (
  urls: readonly string[],
): Promise<void> => {
  await Promise.all(urls.map(preloadImage));
};
