import { useEffect, useRef, useState } from 'react';

// マウントからの経過秒を毎フレーム返す。タイトル/ゲームオーバーの軽い演出用。
export const useRafTime = (): number => {
  const [time, setTime] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const loop = (now: number) => {
      if (startRef.current === null) {
        startRef.current = now;
      }
      setTime((now - startRef.current) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return time;
};
