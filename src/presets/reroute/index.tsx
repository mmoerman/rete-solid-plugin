import {For} from 'solid-js'
import {BaseSchemes} from 'rete'
import {BaseAreaPlugin} from 'rete-area-plugin'
import {Position} from '../../types'
import {RenderPreset} from '../types'
import {Pin} from './components/Pin'
import {PinData, PinsRender} from './types'

type PresetProps = {
  translate?: (id: string, dx: number, dy: number) => void
  contextMenu?: (id: string) => void
  pointerdown?: (id: string) => void
}

/**
 * Preset for rendering pins.
 */
export function setup<Schemes extends BaseSchemes, K extends PinsRender>(props?: PresetProps): RenderPreset<Schemes, K> {
  function renderPins(data: PinData, pointer: () => Position) {
    return (
        <For each={data.pins}>
          {pin => (
              <Pin
                  {...pin}
                  contextMenu={() => props?.contextMenu?.(pin.id)}
                  translate={(dx, dy) => props?.translate?.(pin.id, dx, dy)}
                  pointerdown={() => props?.pointerdown?.(pin.id)}
                  pointer={pointer}
              />
          )}
        </For>
    );
  }

  return {
    render(context, plugin) {
      if (context.data.type === 'reroute-pins') {
        return () => {
          const data = context.data
          const area = plugin.parentScope<BaseAreaPlugin<Schemes, PinsRender>>(BaseAreaPlugin)

          return renderPins(data.data, () => area.area.pointer)
        }
      }
    }
  }
}
