import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { STAGE_HEIGHT, STAGE_WIDTH } from '../../constants/gameConfig';

type StageProps = {
  children: ReactNode;
  stageRef: RefObject<HTMLDivElement | null>;
  onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (event: PointerEvent<HTMLDivElement>) => void;
};

// 論理キャンバス(360×680)をビューポートに合わせて等比スケールし中央寄せする
export function Stage({
  children,
  stageRef,
  onPointerDown,
  onPointerMove,
}: StageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      const el = wrapRef.current;
      if (!el) {
        return;
      }
      setScale(
        Math.min(el.clientWidth / STAGE_WIDTH, el.clientHeight / STAGE_HEIGHT),
      );
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div className="stage-wrap" ref={wrapRef}>
      <div
        className="stage"
        ref={stageRef}
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `scale(${scale})`,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        {children}
      </div>
    </div>
  );
}
