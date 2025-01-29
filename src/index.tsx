import {Component, createRoot, JSX} from 'solid-js'
import { BaseSchemes, CanAssignSignal, Scope } from 'rete'
import { RenderPreset } from './presets/types'
import { getRenderer, Renderer } from './renderer'
import {CreateRoot, Position, RenderSignal} from './types'
import { Root } from './utils'
import {render} from "solid-js/web";

export * as Presets from './presets'
export type { ClassicScheme, SolidArea2D, RenderEmit } from './presets/classic'
export { RefComponent } from './ref-component'
export * from './shared/drag'
export * from './types'
export { useRete } from './utils'

/**
 * Signals that can be emitted by the plugin
 * @priority 9
 */
export type Produces<Schemes extends BaseSchemes> =
    | { type: 'connectionpath', data: { payload: Schemes['Connection'], path?: string, points: Position[] } }

type Requires<Schemes extends BaseSchemes> =
    | RenderSignal<'node', { payload: Schemes['Node'] }>
    | RenderSignal<'connection', { payload: Schemes['Connection'], start?: Position, end?: Position }>
    | { type: 'unmount', data: { element: HTMLElement } }

/**
 * SolidJS plugin. Renders nodes, connections and other elements using SolidJS.
 * @priority 10
 * @listens render
 * @listens unmount
 */
export class SolidPlugin<Schemes extends BaseSchemes, T = Requires<Schemes>> extends Scope<Produces<Schemes>, [Requires<Schemes> | T]> {
  renderer: Renderer
  presets: RenderPreset<Schemes, T>[] = []

  constructor(props?: CreateRoot) {
    super('solid-render')
    if (!props) {
      this.renderer = getRenderer({createRoot: (container: Element | DocumentFragment) => {
          let currentDispose: (() => void) | undefined;

          return {
            render: (createElement: () => Component | JSX.Element) => {
              // Cleanup previous render if it exists
              if (currentDispose) {
                currentDispose()
              }

              // Create new root and store its dispose function
              currentDispose = createRoot((dispose) => {
                const element = createElement();
                const el = typeof element === 'function' ? (element as Component)({}) : element;

                const renderDispose = render(
                    () => el,
                    container
                )

                return () => {
                  renderDispose()
                  dispose()
                }
              })

              return currentDispose
            },
            unmount: () => {
              if (currentDispose) {
                currentDispose()
                currentDispose = undefined
              }
            }
          }
        }
      })
    } else {
      this.renderer = getRenderer({createRoot: props})
    }
    this.addPipe(context => {
      if (!context || typeof context !== 'object' || !('type' in context)) return context

      if (context.type === 'unmount') {
        this.unmount(context.data.element)
      } else if (context.type === 'render') {
        if ('filled' in context.data && context.data.filled) {
          return context
        }
        this.unmount(context.data.element);
        if (this.mount(context.data.element, context)) {
          return {
            ...context,
            data: {
              ...context.data,
              filled: true
            }
          } as typeof context
        }
      }
      return context
    })
  }

  setParent(scope: Scope<Requires<Schemes> | T>): void {
    super.setParent(scope)
    this.presets.forEach(preset => {
      if (preset.attach) preset.attach(this)
    })
  }

  private mount(element: HTMLElement, context: Requires<Schemes>) {
    const parent = this.parentScope()

    for (const preset of this.presets) {
      const result = preset.render(context as any, this)
      if (!result) continue

      const RootComponent: Component = () => (
          <Root rendered={() => void parent.emit({ type: 'rendered', data: context.data } as T)}>
            {result()}
          </Root>
      )

      this.renderer.mount(RootComponent, element)
      return true
    }
  }

  private unmount(element: HTMLElement) {
    this.renderer.unmount(element)
  }

  /**
   * Adds a preset to the plugin.
   * @param preset Preset that can render nodes, connections and other elements.
   */
  public addPreset<K>(preset: RenderPreset<Schemes, CanAssignSignal<T, K> extends true ? K : 'Cannot apply preset. Provided signals are not compatible'>) {
    const local = preset as RenderPreset<Schemes, T>
    if (local.attach)
      local.attach(this)
    this.presets.push(local)
  }
}
