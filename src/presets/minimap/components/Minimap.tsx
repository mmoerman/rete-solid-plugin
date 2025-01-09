import { MiniNode } from './MiniNode';
import { MiniViewport } from './MiniViewport';
import { Component, createEffect } from 'solid-js';
import { Rect, Translate } from '../types';
import { px } from '../utils';

type MinimapProps = {
  size: number;
  ratio: number;
  nodes: Rect[];
  viewport: Rect;
  onTranslate: Translate;
  point: (x: number, y: number) => void;
};

export const Minimap: Component<MinimapProps> = (props) => {
  let container!: HTMLDivElement;

  const scale = (value: number): number => {
    return container?.clientWidth ? value * container.clientWidth : 0;
  };

  const preventDefault = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const handleDoubleClick = (event: MouseEvent) => {
    preventDefault(event);
    if (!container) return;
    const box = container.getBoundingClientRect();
    const x = (event.clientX - box.left) / (props.size * props.ratio);
    const y = (event.clientY - box.top) / (props.size * props.ratio);

    props.point(x, y);
  };

  createEffect(() => {
    // Placeholder for any reactive behaviors that depend on `container`, `props.nodes` or other data
  });

  return (
    <div
      ref={container}
      class="minimap"
      style={{
        "position": 'absolute',
        "right": '24px',
        "bottom": '24px',
        "background": 'rgba(229, 234, 239, 0.65)',
        "padding": '20px',
        "overflow": 'hidden',
        "border": '1px solid #b1b7ff',
        "border-radius": '8px',
        "box-sizing": 'border-box',
        "width": px(props.size * props.ratio),
        "height": px(props.size),
      }}
      onPointerDown={preventDefault}
      onDblClick={handleDoubleClick}
      data-testid="minimap"
    >
      {props.nodes.map((node, index) => (
        <MiniNode
          left={scale(node.left)}
          top={scale(node.top)}
          width={scale(node.width)}
          height={scale(node.height)}
        ></MiniNode>
      ))}
      <MiniViewport
        left={props.viewport.left}
        top={props.viewport.top}
        width={props.viewport.width}
        height={props.viewport.height}
        containerWidth={container ? container.clientWidth : 0}
        onTranslate={props.onTranslate}
      ></MiniViewport>
    </div>
  );
};
