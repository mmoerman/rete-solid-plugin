import { Component, onMount, onCleanup, splitProps } from 'solid-js';

type RefUpdate = (ref: HTMLElement) => void;
type BaseProps = { init: RefUpdate; unmount: RefUpdate } & Record<string, unknown>;

/**
 * Component for rendering various elements embedded in the SolidJS component tree.
 */
export const RefComponent: Component<BaseProps> = (props) => {
    let ref: HTMLSpanElement | undefined;

    // Split props to handle non-ref props separately
    const [localProps, restProps] = splitProps(props, ['init', 'unmount']);

    // Setup lifecycle hooks
    onMount(() => {
        if (ref) {
            localProps.init(ref);
        }
    });

    onCleanup(() => {
        if (ref) {
            localProps.unmount(ref);
        }
    });

    // Return the element
    return <span {...restProps} ref={(el) => (ref = el)} />;
};
