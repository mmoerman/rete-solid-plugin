import { Component } from 'solid-js';
import { px } from '../utils';
import { Translate } from '../types';
import { useDrag } from "../../../shared/drag";

type MiniViewportProps = {
  left: number;
  top: number;
  width: number;
  height: number;
  containerWidth: number;
  onTranslate: Translate;
};

export const MiniViewport: Component<MiniViewportProps> = (props) => {
  // Function for scaling the properties based on container width
  const scale = (v: number) => v * props.containerWidth;

  // Function to invert the scale for translations
  const invert = (v: number) => v / props.containerWidth;

  // Calculate style object based on props
  const styles = () => ({});

  // Callback to handle drag operations
  const onDrag = (dx: number, dy: number) => {
    props.onTranslate(invert(-dx), invert(-dy));
  };

  // Initialize drag logic
  const drag = useDrag(onDrag, e => ({x: e.pageX, y: e.pageY}));

  return (
    <div
      class="mini-viewport"
      style={{
        "left": px(scale(props.left)),
        "top": px(scale(props.top)),
        "width": px(scale(props.width)),
        "height": px(scale(props.height)),
        "position": 'absolute',
        "background": 'rgba(255, 251, 128, 0.32)',
        "border": '1px solid #ffe52b',
      }}
      data-testid="minimap-viewport"
      onPointerDown={drag.start}
    ></div>
  );
};
