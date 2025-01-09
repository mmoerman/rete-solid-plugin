import { Component, createEffect, createSignal, JSXElement, onCleanup } from "solid-js";
import { Position } from "../../../types";

type PositionWatcher = (cb: (value: Position) => void) => () => void;

interface ConnectionWrapperProps {
  start: Position | PositionWatcher;
  end: Position | PositionWatcher;
  path: (start: Position, end: Position) => Promise<null | string>;
  component: (path: string | null, start: Position | null, end: Position | null) => JSXElement;
}

export const ConnectionWrapperElement: Component<ConnectionWrapperProps> = (props) => {
  console.log("Rendering ConnectionWrapperElement");

  const [computedStart, setComputedStart] = createSignal<Position | null>(null);
  const [computedEnd, setComputedEnd] = createSignal<Position | null>(null);
  const [computedPath, setComputedPath] = createSignal<string | null>(null);

  let unwatchStart: (() => void) | null = null;
  let unwatchEnd: (() => void) | null = null;

  // Update the path whenever the computedStart or computedEnd change
  async function updatePath() {
    const start = computedStart();
    const end = computedEnd();
    if (start && end) {
      const path = await props.path(start, end);
      setComputedPath(path);
    }
  }

  // Handle side-effects for start and end, and clean them up on unmount
  createEffect(async () => {
    if (typeof props.start === "function") {
      unwatchStart = props.start((value) => {
        setComputedStart(value);
        updatePath();
      });
    } else {
      setComputedStart(props.start);
      await updatePath();
    }

    if (typeof props.end === "function") {
      unwatchEnd = props.end((value) => {
        setComputedEnd(value);
        updatePath();
      });
    } else {
      setComputedEnd(props.end);
      await updatePath();
    }

    onCleanup(() => {
      // Cleanup watchers if they exist
      unwatchStart?.();
      unwatchEnd?.();
    });
  });

  return (
    <div>{props.component(computedPath(), computedStart(), computedEnd())}</div>
  );
};
