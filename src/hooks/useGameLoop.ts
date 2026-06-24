import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import type {
  GameConfig,
  GameEvent,
  GameState,
  InputState,
} from '../types/game';
import { stepGame } from '../game/gameStep';

const MAX_DT = 0.05;

// requestAnimationFrame でゲームループを回す。playing 中のみ step を実行し、
// 状態は gameRef に直接書き込んで毎フレーム強制再描画する。
export const useGameLoop = (
  active: boolean,
  gameRef: RefObject<GameState>,
  config: GameConfig,
  inputRef: RefObject<InputState>,
  onEvents: (events: GameEvent[]) => void,
): void => {
  const [, force] = useState(0);
  const rerender = useCallback(() => force((n) => n + 1), []);
  const configRef = useRef(config);
  configRef.current = config;
  const onEventsRef = useRef(onEvents);
  onEventsRef.current = onEvents;

  useEffect(() => {
    if (!active) {
      return;
    }
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(MAX_DT, (now - last) / 1000);
      last = now;
      const result = stepGame(
        gameRef.current,
        dt,
        configRef.current,
        inputRef.current,
      );
      gameRef.current = result.state;
      if (result.events.length > 0) {
        onEventsRef.current(result.events);
      }
      rerender();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, gameRef, inputRef, rerender]);
};
