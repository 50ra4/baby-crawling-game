import babyCrawlImg from './baby-crawl.png';
import babyPlayImg from './baby-play.png';
import babyTitleImg from './baby-title.png';
import babySleepImg from './baby-sleep.png';
import ballImg from './ball.png';
import teddyImg from './teddy.png';
import diaperImg from './diaper.png';
import duckImg from './duck.png';
import bottleImg from './bottle.png';

export const SPRITE_SOURCES = {
  babyCrawl: babyCrawlImg,
  babyPlay: babyPlayImg,
  babyTitle: babyTitleImg,
  babySleep: babySleepImg,
  ball: ballImg,
  teddy: teddyImg,
  diaper: diaperImg,
  duck: duckImg,
  bottle: bottleImg,
} as const;

// ゲーム開始前のプリロード対象URL一覧。SPRITE_SOURCES から導出し、手書きの二重管理を避ける。
export const SPRITE_SOURCE_URLS: readonly string[] = Object.values(
  SPRITE_SOURCES,
);
