import { useState, useRef, useCallback } from 'react';
import { FLOAT_DIMENSIONS } from '../utils/constants';

const { width: FLOAT_WIDTH, height: FLOAT_HEIGHT, padding: FLOAT_PADDING } = FLOAT_DIMENSIONS;

function getDefaultFloatPos() {
  if (typeof window === 'undefined') return { x: FLOAT_PADDING, y: FLOAT_PADDING };
  return {
    x: Math.max(window.innerWidth - FLOAT_WIDTH - FLOAT_PADDING * 2, FLOAT_PADDING),
    y: Math.max(window.innerHeight - FLOAT_HEIGHT - FLOAT_PADDING * 2, FLOAT_PADDING),
  };
}

export function useDraggable(enabled: boolean) {
  const [floatPos, setFloatPos] = useState(getDefaultFloatPos);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enabled) return;
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - floatPos.x, y: e.clientY - floatPos.y };

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      setFloatPos({
        x: Math.max(0, Math.min(window.innerWidth - FLOAT_WIDTH - FLOAT_PADDING, ev.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 100, ev.clientY - dragOffset.current.y)),
      });
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [enabled, floatPos]);

  return { floatPos, onMouseDown };
}
