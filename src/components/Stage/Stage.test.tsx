import { createRef } from 'react';
import { render } from '@testing-library/react';
import { Stage } from './Stage';

describe('Stage', () => {
  it('子要素を描画する', () => {
    const ref = createRef<HTMLDivElement>();
    const { getByText } = render(
      <Stage stageRef={ref}>
        <div>あかちゃん</div>
      </Stage>,
    );
    expect(getByText('あかちゃん')).toBeInTheDocument();
  });

  it('論理サイズ360×680のステージを持つ', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Stage stageRef={ref}>
        <div />
      </Stage>,
    );
    const stage = container.querySelector<HTMLElement>('.stage');
    expect(stage?.style.width).toBe('360px');
    expect(stage?.style.height).toBe('680px');
  });
});
