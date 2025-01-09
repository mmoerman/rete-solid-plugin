import { Position } from '../types';

type StartEvent = { pageX: number, pageY: number }

export type Translate = (dx: number, dy: number) => void
export type GetPointer = (e: StartEvent) => Position | null

export function useDrag(translate: Translate, getPointer: GetPointer) {
  const getCurrentPointer = (e: StartEvent) => {
    const pointer = getPointer(e);

    return pointer
      ? { ...pointer }
      : null;
  };

  return {
    start(e: StartEvent) {
      let previous = getCurrentPointer(e);

      function move(moveEvent: MouseEvent) {
        const current = getCurrentPointer(moveEvent);

        if (current && previous) {
          const dx = current.x - previous.x;
          const dy = current.y - previous.y;

          translate(dx, dy);
        }
        previous = current;
      }

      function up() {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
      }

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    }
  };
}
