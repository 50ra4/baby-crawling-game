import { render } from '@testing-library/react';
import { Playfield } from './Playfield';
import { createGameState } from '../../game/createGameState';
import { BABY_Y, DEFAULT_CONFIG } from '../../constants/gameConfig';
import type { GameState } from '../../types/game';

const playingState = (overrides: Partial<GameState> = {}): GameState => ({
  ...createGameState(DEFAULT_CONFIG),
  ...overrides,
});

describe('Playfield', () => {
  it('プレイ中はHUDを表示する', () => {
    const { container } = render(
      <Playfield
        game={playingState()}
        config={DEFAULT_CONFIG}
        screen="playing"
        bestDistance={0}
      />,
    );
    expect(container.querySelector('.hud')).not.toBeNull();
  });

  it('タイトル中はHUDを表示しない', () => {
    const { container } = render(
      <Playfield
        game={playingState()}
        config={DEFAULT_CONFIG}
        screen="title"
        bestDistance={0}
      />,
    );
    expect(container.querySelector('.hud')).toBeNull();
  });

  it('オブジェクトを描画する', () => {
    const game = playingState({
      objects: [
        { id: 1, kind: 'chair', x: 100, y: 100, hit: false, scale: 1, vx: 0 },
      ],
    });
    const { container } = render(
      <Playfield
        game={game}
        config={DEFAULT_CONFIG}
        screen="playing"
        bestDistance={0}
      />,
    );
    expect(container.querySelector('.obj')).not.toBeNull();
  });

  it('接触中は頭上バーストを表示する', () => {
    const game = playingState({ contact: { type: 'hurt', t: 0, dur: 0.6 } });
    const { getByText } = render(
      <Playfield
        game={game}
        config={DEFAULT_CONFIG}
        screen="playing"
        bestDistance={0}
      />,
    );
    expect(getByText('いたっ！')).toBeInTheDocument();
  });

  it('赤ちゃんを論理Y位置に配置する', () => {
    const { container } = render(
      <Playfield
        game={playingState()}
        config={DEFAULT_CONFIG}
        screen="playing"
        bestDistance={0}
      />,
    );
    const baby = container.querySelector<HTMLElement>('.baby');
    expect(baby?.style.top).toBe(`${BABY_Y}px`);
  });
});
