import { Component, createEffect, onCleanup, ParentProps } from 'solid-js';

interface RootElementProps extends ParentProps {
  rendered?: () => void;
}

export const RootElement: Component<RootElementProps> = (props) => {
  // Use `createEffect` to mimic `connectedCallback`.
  createEffect(() => {
    props.rendered?.();

    // Optional cleanup for when the component is removed
    onCleanup(() => {
      // Clean-up logic (if needed)
    });
  });

  return (
    <div>
      {props.children}
    </div>
  );
};

