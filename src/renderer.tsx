import { createEffect, JSXElement } from 'solid-js';
import { render } from 'solid-js/web';
import { RootElement } from './root';

export type Renderer<P extends Record<string, any>> = {
  get(element: HTMLElement): P | undefined;
  mount(element: HTMLElement, slot: JSXElement, onRendered: () => void): void;
  update(app: P, payload: P): void;
  unmount(element: HTMLElement): void;
};

export function getRenderer<P extends Record<string, any>>(): Renderer<P> {
  const instances = new Map<HTMLElement, { instance: P, disposer: () => void }>();

  return {
    get(element) {
      const entry = instances.get(element);
      return entry ? entry.instance : undefined;
    },
    mount(element, slot, onRendered) {
      let instance: P | undefined = undefined;

      const disposer = render(
        () => (
          <RootElement rendered={onRendered}>
            {slot}
          </RootElement>
        ),
        element
      );

      // Simulate getting the instance, in SolidJS you would typically pass props instead of working this way.
      createEffect(() => {
        const childInstance = element.children[0].children[0] as unknown as P;
        if (!instance && childInstance) {
          instance = childInstance;
          instances.set(element, {instance, disposer});
        }
      });

      if (!instance)
        throw new Error('No instance found');
    },
    update(app, payload) {
      Object.assign(app, payload); // Solid's reactive stores will automatically handle this behavior
    },
    unmount(element) {
      const record = instances.get(element);
      if (record) {
        record.disposer(); // Clear SolidJS's reactive DOM tree
        instances.delete(element);
      }
    },
  };
}

