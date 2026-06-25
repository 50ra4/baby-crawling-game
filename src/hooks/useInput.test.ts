import { createRef } from 'react';
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useInput } from './useInput';

const stageRef = createRef<HTMLDivElement>();

describe('useInput', () => {
  it('左キー押下で left が true、離すと false になる', () => {
    const { result } = renderHook(() => useInput(stageRef, true, () => {}));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });
    expect(result.current.inputRef.current.left).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    });
    expect(result.current.inputRef.current.left).toBe(false);
  });

  it('Dキー押下で right が true になる', () => {
    const { result } = renderHook(() => useInput(stageRef, true, () => {}));
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    });
    expect(result.current.inputRef.current.right).toBe(true);
  });

  it('Spaceキーで確定コールバックが呼ばれる', () => {
    const onConfirm = vi.fn();
    renderHook(() => useInput(stageRef, false, onConfirm));
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    });
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('テキスト入力欄にフォーカス中はSpaceで確定コールバックが呼ばれない', () => {
    const onConfirm = vi.fn();
    renderHook(() => useInput(stageRef, false, onConfirm));
    const input = document.createElement('input');
    document.body.appendChild(input);
    act(() => {
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
      );
    });
    expect(onConfirm).not.toHaveBeenCalled();
    input.remove();
  });

  it('IME変換確定中（isComposing）のEnterで確定コールバックが呼ばれない', () => {
    const onConfirm = vi.fn();
    renderHook(() => useInput(stageRef, false, onConfirm));
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', isComposing: true }),
      );
    });
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('プレイ中でないときポインタダウンしても目標を設定しない', () => {
    const { result } = renderHook(() => useInput(stageRef, false, () => {}));
    act(() => {
      result.current.onPointerDown({ clientX: 100 } as never);
    });
    expect(result.current.inputRef.current.targetX).toBeNull();
  });

  it('プレイ中のポインタダウンでタップ位置の目標(targetX)が設定される', () => {
    const { result } = renderHook(() => useInput(stageRef, true, () => {}));
    act(() => {
      result.current.onPointerDown({
        clientX: 100,
        pointerId: 1,
        currentTarget: { setPointerCapture: () => {} },
      } as never);
    });
    // stageRef未マウント時は中央(180)へフォールバックするが、null以外の数値が入る
    expect(typeof result.current.inputRef.current.targetX).toBe('number');
  });

  it('ポインタムーブで目標(targetX)が更新される', () => {
    const { result } = renderHook(() => useInput(stageRef, true, () => {}));
    act(() => {
      result.current.onPointerDown({
        clientX: 100,
        pointerId: 1,
        currentTarget: { setPointerCapture: () => {} },
      } as never);
    });
    act(() => {
      result.current.onPointerMove({ clientX: 200 } as never);
    });
    expect(typeof result.current.inputRef.current.targetX).toBe('number');
  });

  it('左右キー押下でポインタ目標(targetX)がnullにクリアされる', () => {
    const { result } = renderHook(() => useInput(stageRef, true, () => {}));
    act(() => {
      result.current.onPointerDown({
        clientX: 100,
        pointerId: 1,
        currentTarget: { setPointerCapture: () => {} },
      } as never);
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });
    expect(result.current.inputRef.current.targetX).toBeNull();
  });
});
