import { BaseSchemes, CanAssignSignal, Scope } from 'rete';

import { RenderPreset } from './presets/types';
import { getRenderer, Renderer } from './renderer';
import { RootElement } from './root';
import { Position, RenderSignal } from './types';

import { customElement } from "solid-element";

export * as Presets from './presets'
export type { ClassicScheme, SolidArea2D, RenderEmit } from './presets/classic'
export * from './types'

customElement('rete-root', RootElement);

/**
 * Signals that can be emitted by the plugin
 * @priority 9
 */
export type Produces<Schemes extends BaseSchemes> =
  | { type: 'connectionpath', data: { payload: Schemes['Connection'], path?: string, points: Position[] } }

export type Requires<Schemes extends BaseSchemes> =
  | RenderSignal<'node', { payload: Schemes['Node'] }>
  | RenderSignal<'connection', { payload: Schemes['Connection'], start?: Position, end?: Position }>
  | { type: 'unmount', data: { element: HTMLElement } }

/**
 * Renders nodes, connections and other elements using React.
 * @priority 10
 * @emits connectionpath
 * @listens render
 * @listens unmount
 */
export class SolidJSPlugin<Schemes extends BaseSchemes, T = Requires<Schemes>> extends Scope<Produces<Schemes>, [Requires<Schemes> | T]> {
  presets: RenderPreset<Schemes, T>[] = [];
  renderer: Renderer<Record<string, unknown>>;
  owners = new WeakMap<HTMLElement, RenderPreset<Schemes, T>>();

  constructor() {
    super('rete-solidjs-plugin');

    this.renderer = getRenderer();

    this.addPipe(context => {
      if (!context || typeof context !== 'object' || !('type' in context)) return context;
      if (context.type === 'unmount') {
        this.unmount(context.data.element);
      } else if (context.type === 'render') {
        if ('filled' in context.data && context.data.filled) {
          return context;
        }
        if (this.mount(context.data.element, context as unknown as Extract<T, { type: 'render' }>)) {
          return {
            ...context,
            data: {
              ...context.data,
              filled: true
            }
          } as typeof context;
        }
      }

      return context;
    });
  }

  setParent(scope: Scope<Requires<Schemes> | T>): void {
    super.setParent(scope);

    this.presets.forEach(preset => {
      if (preset.attach)
        preset.attach(this);
    });
  }

  private mount(element: HTMLElement, context: Extract<T, { type: 'render' }>) {
    const existing = this.renderer.get(element);
    const parent = this.parentScope();

    if (existing) {
      this.presets.forEach(preset => {
        if (this.owners.get(element) !== preset) return;
        const result = preset.update(context, this);

        if (result) {
          this.renderer.update(existing, result);
        }
      });
      return true;
    }

    for (const preset of this.presets) {
      const result = preset.render(context, this);

      if (!result)
        continue;

      const {data} = context as unknown as Requires<Schemes>;

      this.renderer.mount(
        element,
        result,
        () => void parent.emit({type: 'rendered', data} as Requires<Schemes>)
      );

      this.owners.set(element, preset);
      return true;
    }
  }

  private unmount(element: HTMLElement) {
    this.owners.delete(element);
    this.renderer.unmount(element);
  }

  /**
   * Adds a preset to the plugin.
   * @param preset Preset that can render nodes, connections and other elements.
   */
  public addPreset<K>(preset: RenderPreset<Schemes, CanAssignSignal<T, K> extends true ? K : 'Cannot apply preset. Provided signals are not compatible'>) {
    const local = preset as RenderPreset<Schemes, T>;

    if (local.attach)
      local.attach(this);
    this.presets.push(local);
  }
}
