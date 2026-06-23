import type { ChangeEvent } from 'react';
import type { CrawlStyle } from '../../../types/game';
import { Baby } from '../../sprites/Baby/Baby';
import { useRafTime } from '../../../hooks/useRafTime';

const PREVIEW_CRAWL_SPEED = 1.6;
const NAME_MAX_LENGTH = 8;

type TitleScreenProps = {
  name: string;
  skin: string;
  cloth: string;
  crawlStyle: CrawlStyle;
  bounce: number;
  bestDistance: number;
  onChangeName: (name: string) => void;
  onStart: () => void;
};

// タイトル画面：ロゴ＋ハイハイプレビュー＋名前入力＋はじめる
export function TitleScreen({
  name,
  skin,
  cloth,
  crawlStyle,
  bounce,
  bestDistance,
  onChangeName,
  onStart,
}: TitleScreenProps) {
  const time = useRafTime();
  const phase = (time * PREVIEW_CRAWL_SPEED) % 1;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeName(event.target.value);
  };

  return (
    <div className="overlay title">
      <div className="t-badge">Baby Crawl Run</div>
      <h1 className="t-title">
        はいはい！
        <br />
        ベビーラン
      </h1>
      <div className="t-baby">
        <Baby
          phase={phase}
          crawlStyle={crawlStyle}
          bounce={bounce}
          skin={skin}
          cloth={cloth}
          size={132}
        />
      </div>
      <label className="t-namelbl" htmlFor="baby-name">
        あかちゃんの なまえ
      </label>
      <input
        id="baby-name"
        className="t-name"
        value={name}
        maxLength={NAME_MAX_LENGTH}
        onChange={handleChange}
        placeholder="なまえ"
      />
      <button className="t-start" onClick={onStart}>
        はじめる
      </button>
      <div className="t-hint">
        ← → / A D で よけてね ・ ドラッグでも うごくよ
      </div>
      {bestDistance > 0 && <div className="t-best">ベスト {bestDistance}m</div>}
    </div>
  );
}
