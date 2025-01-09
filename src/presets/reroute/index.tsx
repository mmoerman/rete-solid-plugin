import { BaseSchemes } from 'rete';
import { BaseAreaPlugin } from 'rete-area-plugin';
import { RenderPreset } from '../types';
import { Pin } from './components/Pin';
import { Pins } from './components/Pins';
import { PinsRender } from './types';
import { customElement } from "solid-element";

customElement('rete-pins', Pins);
customElement('rete-pin', Pin);

type Props = {
  translate?: (id: string, dx: number, dy: number) => void
  contextMenu?: (id: string) => void
  pointerdown?: (id: string) => void
}

/**
 * Preset for rendering pins.
 */
export function setup<Schemes extends BaseSchemes, K extends PinsRender>(props?: Props): RenderPreset<Schemes, K> {
  return {
    update(context) {
      if (context.data.type === 'reroute-pins') {
        return {
          menu: props?.contextMenu || (() => null),
          translate: props?.translate || (() => null),
          down: props?.pointerdown || (() => null),
          pins: context.data.data.pins
        };
      }
    },
    render(context, plugin) {
      if (context.data.type === 'reroute-pins') {
        const area = plugin.parentScope<BaseAreaPlugin<Schemes, PinsRender>>(BaseAreaPlugin);

        return (
          <Pins
            onMenu={props?.contextMenu || (() => null)}
            onTranslate={props?.translate || (() => null)}
            onDown={props?.pointerdown || (() => null)}
            getPointer={() => area.area.pointer}
            pins={context.data.data.pins}
          />
        );
      }
    }
  };
}
