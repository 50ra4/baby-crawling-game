import { createRef } from 'react';
import { renderHook } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { useGameLoop } from './useGameLoop';
import { createGameState } from '../game/createGameState';
import { DEFAULT_CONFIG } from '../constants/gameConfig';
import type { GameState, InputState } from '../types/game';

const noInput: InputState = {
  left: false,
  right: false,
  targetX: null,
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useGameLoop', () => {
  it('active のとき1フレーム進めると経過時間が増える', () => {
    // rAFのコールバックを1回だけ同期実行するスタブ（無限再帰を防ぐ）
    let now = 1000;
    let invoked = false;
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      if (!invoked) {
        invoked = true;
        now += 16;
        cb(now);
      }
      return 1;
    });
    vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});

    const gameRef = createRef<GameState>() as { current: GameState };
    gameRef.current = createGameState(DEFAULT_CONFIG);
    const inputRef = { current: noInput };

    renderHook(() =>
      useGameLoop(true, gameRef, DEFAULT_CONFIG, inputRef, () => {}),
    );

    expect(gameRef.current.elapsed).toBeGreaterThan(0);
  });

  it('inactive のときは step を実行しない', () => {
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(() => 1);

    const gameRef = createRef<GameState>() as { current: GameState };
    gameRef.current = createGameState(DEFAULT_CONFIG);
    const inputRef = { current: noInput };

    renderHook(() =>
      useGameLoop(false, gameRef, DEFAULT_CONFIG, inputRef, () => {}),
    );

    expect(gameRef.current.elapsed).toBe(0);
  });
});
