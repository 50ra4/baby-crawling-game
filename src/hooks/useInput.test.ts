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

  it('プレイ中でないときポインタダウンしてもドラッグしない', () => {
    const { result } = renderHook(() => useInput(stageRef, false, () => {}));
    act(() => {
      result.current.onPointerDown({ clientX: 100 } as never);
    });
    expect(result.current.inputRef.current.dragging).toBe(false);
  });
});
