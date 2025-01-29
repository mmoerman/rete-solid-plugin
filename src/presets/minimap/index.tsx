import {BaseSchemes} from 'rete'
import {RenderPreset} from '../types'
import {Minimap} from './components/Minimap'
import {MinimapRender} from './types'

type MinimapProps = {
  size?: number
}

/**
 * Preset for rendering minimap.
 */
export function setup<Schemes extends BaseSchemes, K extends MinimapRender>(props?: MinimapProps): RenderPreset<Schemes, K> {
  return {
    render(context, _) {
      if (context.data.type === 'minimap') {
        return () => {
          return (
              <Minimap
                  nodes={context.data.nodes}
                  size={props?.size || 200}
                  ratio={context.data.ratio}
                  viewport={context.data.viewport}
                  start={context.data.start}
                  translate={context.data.translate}
                  point={context.data.point}
              />
          );
        }
      }
    }
  }
}