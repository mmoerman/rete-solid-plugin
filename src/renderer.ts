import { render } from 'solid-js/web'
import { Component, JSX } from 'solid-js'
import { CreateRoot } from "./types";

export type Renderer = {
  mount: (element: Component | JSX.Element, container: HTMLElement) => () => void
  unmount: (container: HTMLElement) => void
}

export function getRenderer(props?: { createRoot?: CreateRoot }): Renderer {
  const createRoot = props?.createRoot
  const wrappers = new WeakMap<HTMLElement, HTMLElement>()
  const disposers = new WeakMap<HTMLElement, () => void>()


  function getOrCreateWrapper(container: HTMLElement) {
    const wrapper = wrappers.get(container)
    if (wrapper) return wrapper

    const span = document.createElement('span')
    container.appendChild(span)
    return wrappers.set(container, span).get(container)!
  }

  function cleanupChildren(container: HTMLElement, cleanup:(wrapper: HTMLElement) => void) {
    // first we see if the container has children that need cleaning up.
    for (const child of container.children) {
      const childElement = child as HTMLElement;
      const wrapper = wrappers.get(childElement);

      if (wrapper)
        cleanupWrapperForContainer(childElement, wrapper, cleanup);
      if (child.children.length > 0)
        cleanupChildren(childElement, cleanup);
    }
  }

  function cleanupWrapperForContainer(container: HTMLElement, wrapper: HTMLElement, cleanup:(wrapper: HTMLElement) => void) {
    cleanupChildren(container, cleanup);
    cleanup(wrapper);
    wrapper.remove();
    wrappers.delete(container);
  }

  if (createRoot) {
    const roots = new WeakMap<HTMLElement, ReturnType<CreateRoot>>()

    return {
      mount: (element: Component | JSX.Element, container: HTMLElement) => {
        const wrapper = getOrCreateWrapper(container)
        if (!roots.has(wrapper)) {
          roots.set(wrapper, createRoot(wrapper))
        }
        const root = roots.get(wrapper)!
        const dispose = root.render(() => element)
        disposers.set(wrapper, dispose)
        return dispose
      },
      unmount: (container: HTMLElement) => {
        const wrapper = wrappers.get(container)
        if (wrapper) {
          cleanupWrapperForContainer(container, wrapper, (wrapper) => {
            const root = roots.get(wrapper)
            const dispose = disposers.get(wrapper)

            if (dispose) {
              dispose()
              disposers.delete(wrapper)
            }
            if (root) {
              root.unmount()
              roots.delete(wrapper)
            }
          });
        } else {
          // Note - the below will create noise in the debug logs, may need to remove it at some point.
          console.debug(`Could not dispose of container ${container} as we couldn't find a wrapper for it`)
        }
      }
    }
  }

  return {
    mount: (element: Component | JSX.Element, container: HTMLElement) => {
      const wrapper = getOrCreateWrapper(container)
      if (typeof element === "function") {
        const comp = element as Component;

        element = comp({});
      }
      const dispose = render(() => element, wrapper)
      disposers.set(wrapper, dispose)
      return dispose
    },
    unmount: (container: HTMLElement) => {
      const wrapper = wrappers.get(container);

      if (wrapper) {
        cleanupWrapperForContainer(container, wrapper, (wrapper) => {

          const dispose = disposers.get(wrapper)

          if (dispose) {
            dispose()
            disposers.delete(wrapper)
          }
        });
      } else {
        console.debug(`Could not dispose of container ${container} as we couldn't find a wrapper for it`)
      }
    }
  }
}
