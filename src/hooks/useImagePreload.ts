import { useEffect, useState } from 'react';
import { preloadImages } from '../utils/preloadImages';

// 渡されたURL群の読み込みが完了するまで false を返す（ゲーム開始ゲート用）。
export const useImagePreload = (urls: readonly string[]): boolean => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void preloadImages(urls).then(() => {
      if (!cancelled) {
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [urls]);

  return ready;
};
