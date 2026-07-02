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
        { id: 1, kind: 'teddy', x: 100, y: 100, hit: false, scale: 1, vx: 0 },
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

  it('オブジェクトのコンテナに明示的な幅高さ(base×scale)が付く', () => {
    const game = playingState({
      objects: [
        { id: 1, kind: 'teddy', x: 100, y: 100, hit: false, scale: 1, vx: 0 },
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
    const obj = container.querySelector<HTMLElement>('.obj');
    // teddy base=76, scale=1
    expect(obj?.style.width).toBe('76px');
    expect(obj?.style.height).toBe('76px');
  });

  it('画面右端寄り(left大)でもオブジェクトの幅は縮まずsizeを保つ', () => {
    const game = playingState({
      objects: [
        { id: 1, kind: 'ball', x: 312, y: 100, hit: false, scale: 1, vx: 0 },
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
    const obj = container.querySelector<HTMLElement>('.obj');
    // ball base=54。利用可能幅(360-312=48)に依存せずsize=54を保つ
    expect(obj?.style.width).toBe('54px');
  });

  it('赤ちゃんのコンテナに明示的な幅が付く', () => {
    const { container } = render(
      <Playfield
        game={playingState()}
        config={DEFAULT_CONFIG}
        screen="playing"
        bestDistance={0}
      />,
    );
    const baby = container.querySelector<HTMLElement>('.baby');
    expect(baby?.style.width).toBe('96px');
  });

  it('接触中は頭上バーストを表示する', () => {
    const game = playingState({ contact: { type: 'play', t: 0, dur: 0.6 } });
    const { getByText } = render(
      <Playfield
        game={game}
        config={DEFAULT_CONFIG}
        screen="playing"
        bestDistance={0}
      />,
    );
    expect(getByText('わーい！')).toBeInTheDocument();
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
