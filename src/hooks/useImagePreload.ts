import { useEffect, useState } from 'react';
import { preloadImages } from '../utils/preloadImages';
import { SPRITE_SOURCE_URLS } from '../assets/sprites/spriteSources';

export type PreloadStatus = 'loading' | 'ready';

// ゲーム開始前に全スプライト画像を先読みする（外部リソース読み込みの副作用同期）。
// デフォルト引数はモジュール定数を参照するため常に同一参照となり、effectは一度だけ実行される。
export const useImagePreload = (
  sources: readonly string[] = SPRITE_SOURCE_URLS,
): PreloadStatus => {
  const [status, setStatus] = useState<PreloadStatus>('loading');

  useEffect(() => {
    let active = true;
    const run = async () => {
      await preloadImages(sources);
      if (active) {
        setStatus('ready');
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [sources]);

  return status;
};
