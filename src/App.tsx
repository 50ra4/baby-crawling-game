import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  GameConfig,
  GameEvent,
  GameScreen,
  GameState,
  Gender,
} from './types/game';
import { DEFAULT_CONFIG } from './constants/gameConfig';
import { createGameState } from './game/createGameState';
import {
  loadBest,
  loadGender,
  loadName,
  saveBest,
  saveGender,
  saveName,
} from './utils/storage';
import { displayName as resolveName } from './utils/displayName';
import { gameAudio } from './audio/gameAudio';
import { useInput } from './hooks/useInput';
import { useGameLoop } from './hooks/useGameLoop';
import { useImagePreload } from './hooks/useImagePreload';
import { Stage } from './components/Stage/Stage';
import { Playfield } from './components/Playfield/Playfield';
import { TitleScreen } from './components/screens/TitleScreen/TitleScreen';
import { GameOverScreen } from './components/screens/GameOverScreen/GameOverScreen';

const GAME_OVER_DELAY_MS = 350;

const createInitialConfig = (): GameConfig => ({
  ...DEFAULT_CONFIG,
  name: loadName(),
  gender: loadGender(),
});

export function App() {
  const [config, setConfig] = useState<GameConfig>(createInitialConfig);
  const [screen, setScreen] = useState<GameScreen>('title');

  const gameRef = useRef<GameState>(createGameState(config));
  const bestRef = useRef(loadBest());
  const lastResultRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const preloadStatus = useImagePreload();

  // 効果音のON/OFFを同期（外部のオーディオ状態との同期）
  useEffect(() => {
    gameAudio.setSfx(config.sfxOn);
  }, [config.sfxOn]);

  // BGMはプレイ中かつ設定ONのときのみ鳴らす
  useEffect(() => {
    gameAudio.setBgm(screen === 'playing' && config.bgmOn);
  }, [screen, config.bgmOn]);

  const start = useCallback(() => {
    // 画像プリロード完了前は開始させない
    if (preloadStatus !== 'ready') {
      return;
    }
    gameAudio.init();
    gameAudio.sfx('start');
    gameRef.current = createGameState(config);
    setScreen('playing');
  }, [config, preloadStatus]);

  const toTitle = useCallback(() => {
    gameAudio.setBgm(false);
    gameRef.current = createGameState(config);
    setScreen('title');
  }, [config]);

  const handleConfirm = useCallback(() => {
    setScreen((current) => {
      if (current === 'title' || current === 'over') {
        // 画像プリロード完了前は遷移させない（Space/Enterによる開始もブロック）
        if (preloadStatus !== 'ready') {
          return current;
        }
        gameAudio.init();
        gameAudio.sfx('start');
        gameRef.current = createGameState(config);
        return 'playing';
      }
      return current;
    });
  }, [config, preloadStatus]);

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

  const handleChangeGender = useCallback((gender: Gender) => {
    setConfig((current) => ({ ...current, gender }));
    saveGender(gender);
  }, []);

  const { inputRef, onPointerDown, onPointerMove, onPointerUp } = useInput(
    stageRef,
    screen === 'playing',
    handleConfirm,
  );

  useGameLoop(screen === 'playing', gameRef, config, inputRef, handleEvents);

  return (
    <div className="h-full">
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
            gender={config.gender}
            crawlStyle={config.crawlStyle}
            bestDistance={bestRef.current.dist}
            onChangeName={handleChangeName}
            onChangeGender={handleChangeGender}
            onStart={start}
            ready={preloadStatus === 'ready'}
          />
        )}
        {screen === 'over' && (
          <GameOverScreen
            displayName={resolveName(config.name, config.gender)}
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
