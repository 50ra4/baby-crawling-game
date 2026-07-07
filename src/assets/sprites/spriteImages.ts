import ballImg from './ball.png';
import bottleImg from './bottle.png';
import diaperImg from './diaper.png';
import teddyImg from './teddy.png';
import duckImg from './duck.png';
import babyCrawlImg from './baby-crawl.png';
import babyPlayImg from './baby-play.png';
import babyTitleImg from './baby-title.png';
import babySleepImg from './baby-sleep.png';

export {
  ballImg,
  bottleImg,
  diaperImg,
  teddyImg,
  duckImg,
  babyCrawlImg,
  babyPlayImg,
  babyTitleImg,
  babySleepImg,
};

// ゲーム開始前に一括プリロードする対象（App.tsx で使用）
export const SPRITE_IMAGE_URLS = [
  ballImg,
  bottleImg,
  diaperImg,
  teddyImg,
  duckImg,
  babyCrawlImg,
  babyPlayImg,
  babyTitleImg,
  babySleepImg,
] as const;
