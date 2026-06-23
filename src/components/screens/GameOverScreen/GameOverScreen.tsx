import type { CSSProperties } from 'react';
import { SleepingBaby } from '../../sprites/SleepingBaby/SleepingBaby';
import { Zzz } from '../../sprites/Zzz/Zzz';
import { useRafTime } from '../../../hooks/useRafTime';

const ZZZ_LAYER_STYLE: CSSProperties = {
  overflow: 'visible',
  position: 'absolute',
  inset: 0,
  zIndex: 2,
};

type GameOverScreenProps = {
  name: string;
  skin: string;
  cloth: string;
  resultDistance: number;
  bestDistance: number;
  onRetry: () => void;
  onTitle: () => void;
};

// ゲームオーバー画面：眠る赤ちゃん＋ZZZ＋結果＋もういっかい/タイトル
export function GameOverScreen({
  name,
  skin,
  cloth,
  resultDistance,
  bestDistance,
  onRetry,
  onTitle,
}: GameOverScreenProps) {
  const time = useRafTime();
  return (
    <div className="overlay over">
      <div className="o-over">ゲームオーバー</div>
      <div className="o-title">すやすや… おやすみなさい</div>
      <div className="o-name">{name || 'あかちゃん'} は ねむっちゃった</div>
      <div className="o-baby">
        <svg
          width="240"
          height="172"
          viewBox="0 0 240 172"
          style={ZZZ_LAYER_STYLE}
        >
          <Zzz t={time} x={104} y={64} />
        </svg>
        <SleepingBaby skin={skin} cloth={cloth} size={236} t={time} />
      </div>
      <div className="o-stats">
        <div className="o-stat">
          <span>こんかい</span>
          <b>
            {resultDistance}
            <i>m</i>
          </b>
        </div>
        <div className="o-stat best">
          <span>ベスト</span>
          <b>
            {bestDistance}
            <i>m</i>
          </b>
        </div>
      </div>
      <div className="o-btns">
        <button className="t-start" onClick={onRetry}>
          もういっかい
        </button>
        <button className="t-start ghost" onClick={onTitle}>
          タイトル
        </button>
      </div>
    </div>
  );
}
