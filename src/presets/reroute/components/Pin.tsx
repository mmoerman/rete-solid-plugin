import { Component, onCleanup, onMount } from 'solid-js';
import { GetPointer, useDrag } from '../../../shared/drag';
import { Position } from '../types';

const pinSize = 20;

type PinProps = {
  position: Position;
  selected: boolean;
  getPointer: GetPointer;
  onDown?: (event: PointerEvent) => void;
  onMenu?: (event: MouseEvent) => void;
  onTranslate?: (dx: number, dy: number) => void;
};

export const Pin: Component<PinProps> = (props) => {
  let drag: null | ReturnType<typeof useDrag> = null;

  const style = () => ({});

  const onPointerDown = (event: PointerEvent) => {
    event.stopPropagation();
    event.preventDefault();
    drag?.start(event);
    props.onDown?.(event);
  };

  const onContextMenu = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    props.onMenu?.(event);
  };

  const onDrag = (dx: number, dy: number) => {
    props.onTranslate?.(dx, dy);
  };

  // Initialize drag on mount
  onMount(() => {
    drag = useDrag(onDrag, props.getPointer);
  });

  // Cleanup drag instance on unmount
  onCleanup(() => {
    drag = null;
  });

  return (
    <div
      class="pin"
      style={{
        "top": `${props.position.y - pinSize / 2}px`,
        "left": `${props.position.x - pinSize / 2}px`,
        "width": `${pinSize}px`,
        "height": `${pinSize}px`,
        "box-sizing": 'border-box',
        "background": props.selected ? '#ffd92c' : 'steelblue',
        "border": '2px solid white',
        "border-radius": `${pinSize}px`,
        "position": 'absolute',
      }}
      onPointerDown={onPointerDown}
      onContextMenu={onContextMenu}
      data-testid="pin"
    ></div>
  );
};
