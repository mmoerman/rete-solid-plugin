import { BaseSchemes } from 'rete';

import { RenderPreset } from '../types';
import { Minimap } from './components/Minimap';
import { MiniNode } from './components/MiniNode';
import { MiniViewport } from './components/MiniViewport';
import { MinimapRender } from './types';
import { customElement } from "solid-element";
import { JSXElement } from "solid-js";

customElement('rete-minimap', Minimap);
customElement('rete-mini-node', MiniNode);
customElement('rete-mini-viewport', MiniViewport);

/**
 * Preset for rendering minimap.
 */
export function setup<Schemes extends BaseSchemes, K extends MinimapRender>(props?: {
  size?: number
}): RenderPreset<Schemes, K> {
  return {
    update(context) {
      if (context.data.type === 'minimap') {
        return {
          nodes: context.data.nodes,
          size: props?.size || 200,
          ratio: context.data.ratio,
          viewport: context.data.viewport,
          onTranslate: context.data.translate,
          point: context.data.point
        };
      }
    },
    render(context): JSXElement {
      if (context.data.type === 'minimap') {
        return (
          <Minimap
            nodes={context.data.nodes}
            size={props?.size || 200}
            ratio={context.data.ratio}
            viewport={context.data.viewport}
            onTranslate={context.data.translate}
            point={context.data.point}
          ></Minimap>
        );
      }
    }
  };
}
