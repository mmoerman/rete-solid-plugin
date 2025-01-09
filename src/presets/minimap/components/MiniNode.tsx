import { Component } from 'solid-js';
import { px } from '../utils';

type MiniNodeProps = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export const MiniNode: Component<MiniNodeProps> = (props) => {
  // Computed styles based on props
  const styles = () => ({
    left: px(props.left),
    top: px(props.top),
    width: px(props.width),
    height: px(props.height),
  });

  return (
    <div
      class="mini-node"
      style={{
        ...styles(),
        position: 'absolute',
        background: 'rgba(110, 136, 255, 0.8)',
        border: '1px solid rgb(192 206 212 / 60%)',
      }}
      data-testid="minimap-node"
    ></div>
  );
};
