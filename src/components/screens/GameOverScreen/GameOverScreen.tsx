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
  displayName: string;
  resultDistance: number;
  bestDistance: number;
  onRetry: () => void;
  onTitle: () => void;
};

// ゲームオーバー画面：眠る赤ちゃん＋ZZZ＋結果＋もういっかい/タイトル
export function GameOverScreen({
  displayName,
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
      <div className="mb-0.5 text-[13px] font-bold text-[#c2c9ee]">
        {displayName} は ねむっちゃった
      </div>
      <div className="relative my-1.5 flex h-[165px] w-[230px] items-center justify-center">
        <svg
          width="240"
          height="172"
          viewBox="0 0 240 172"
          style={ZZZ_LAYER_STYLE}
        >
          <Zzz t={time} x={104} y={64} />
        </svg>
        <SleepingBaby size={236} t={time} />
      </div>
      <div className="mt-2 mb-1 flex gap-3.5">
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
      <div className="mt-3.5 flex gap-3">
        <button
          className="t-start mt-0 px-[26px] py-[11px] text-[17px]"
          onClick={onRetry}
        >
          もういっかい
        </button>
        <button
          className="t-start ghost mt-0 px-[26px] py-[11px] text-[17px]"
          onClick={onTitle}
        >
          タイトル
        </button>
      </div>
    </div>
  );
}
