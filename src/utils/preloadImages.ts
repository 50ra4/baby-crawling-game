// 指定したURL群の画像をすべて事前読み込みする。1枚でも読み込みに失敗した場合でも
// 永久にブロックしないよう、失敗（onerror）も成功（onload）として扱いresolveする。
export const preloadImages = async (
  sources: readonly string[],
): Promise<void> => {
  const load = (source: string): Promise<void> =>
    new Promise<void>((resolve) => {
      const img = new Image();
      // ハンドラの取りこぼしを防ぐため、src代入より先にonload/onerrorを設定する
      img.onload = () => resolve();
      img.onerror = () => resolve();
      // 画像取得を開始するDOM操作（ミューテーションではなく許容される副作用）
      img.src = source;
    });

  await Promise.all(sources.map(load));
};
