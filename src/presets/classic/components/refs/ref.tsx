import { Component, onCleanup, onMount } from 'solid-js';
import { ClassicScheme, RenderEmit } from "../../index";

interface RefElementProps {
  data: unknown;
  emit?: RenderEmit<ClassicScheme>;
}

export const RefElement: Component<RefElementProps> = (props) => {
  let element: HTMLDivElement | undefined;

  // Setup lifecycle hooks
  onMount(() => {
    if (props.emit) {
      props.emit({
        type: 'render',
        data: {
          ...props.data as any,
          element,
        },
      });
    }
  });

  onCleanup(() => {
    if (props.emit && element) {
      props.emit({
        type: 'unmount',
        data: {element},
      });
    }
  });

  return (
    <div
      ref={(el) => {
        element = el;
        if (element) {
          element.style.display = 'block';
        }
      }}
    ></div>
  );
};
