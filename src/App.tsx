import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  GameConfig,
  GameEvent,
  GameScreen,
  GameState,
} from './types/game';
import { DEFAULT_CONFIG } from './constants/gameConfig';
import { createGameState } from './game/createGameState';
import { loadBest, loadName, saveBest, saveName } from './utils/storage';
import { gameAudio } from './audio/gameAudio';
import { useInput } from './hooks/useInput';
import { useGameLoop } from './hooks/useGameLoop';
import { Stage } from './components/Stage/Stage';
import { Playfield } from './components/Playfield/Playfield';
import { TitleScreen } from './components/screens/TitleScreen/TitleScreen';
import { GameOverScreen } from './components/screens/GameOverScreen/GameOverScreen';

const GAME_OVER_DELAY_MS = 350;

const createInitialConfig = (): GameConfig => ({
  ...DEFAULT_CONFIG,
  name: loadName(),
});

export function App() {
  const [config, setConfig] = useState<GameConfig>(createInitialConfig);
  const [screen, setScreen] = useState<GameScreen>('title');

  const gameRef = useRef<GameState>(createGameState(config));
  const bestRef = useRef(loadBest());
  const lastResultRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);

  // 効果音のON/OFFを同期（外部のオーディオ状態との同期）
  useEffect(() => {
    gameAudio.setSfx(config.sfxOn);
  }, [config.sfxOn]);

  // BGMはプレイ中かつ設定ONのときのみ鳴らす
  useEffect(() => {
    gameAudio.setBgm(screen === 'playing' && config.bgmOn);
  }, [screen, config.bgmOn]);

  const start = useCallback(() => {
    gameAudio.init();
    gameAudio.sfx('start');
    gameRef.current = createGameState(config);
    setScreen('playing');
  }, [config]);

  const toTitle = useCallback(() => {
    gameAudio.setBgm(false);
    gameRef.current = createGameState(config);
    setScreen('title');
  }, [config]);

  const handleConfirm = useCallback(() => {
    setScreen((current) => {
      if (current === 'title' || current === 'over') {
        gameAudio.init();
        gameAudio.sfx('start');
        gameRef.current = createGameState(config);
        return 'playing';
      }
      return current;
    });
  }, [config]);

  const handleEvents = useCallback((events: GameEvent[]) => {
    for (const event of events) {
      if (event.type === 'sfx') {
        gameAudio.sfx(event.name);
        continue;
      }
      // gameover
      gameAudio.sfx('gameover');
      gameAudio.setBgm(false);
      lastResultRef.current = event.dist;
      if (event.dist > bestRef.current.dist) {
        bestRef.current = { dist: event.dist, score: event.dist };
        saveBest(bestRef.current);
      }
      window.setTimeout(() => setScreen('over'), GAME_OVER_DELAY_MS);
    }
  }, []);

  const handleChangeName = useCallback((name: string) => {
    setConfig((current) => ({ ...current, name }));
    saveName(name);
  }, []);

  const { inputRef, onPointerDown, onPointerMove, onPointerUp } = useInput(
    stageRef,
    screen === 'playing',
    handleConfirm,
  );

  useGameLoop(screen === 'playing', gameRef, config, inputRef, handleEvents);

  return (
    <div className="root">
      <Stage
        stageRef={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <Playfield
          game={gameRef.current}
          config={config}
          screen={screen}
          bestDistance={bestRef.current.dist}
        />
        {screen === 'title' && (
          <TitleScreen
            name={config.name}
            crawlStyle={config.crawlStyle}
            bounce={config.bounceHeight}
            bestDistance={bestRef.current.dist}
            onChangeName={handleChangeName}
            onStart={start}
          />
        )}
        {screen === 'over' && (
          <GameOverScreen
            name={config.name}
            resultDistance={lastResultRef.current}
            bestDistance={bestRef.current.dist}
            onRetry={start}
            onTitle={toTitle}
          />
        )}
      </Stage>
    </div>
  );
}
