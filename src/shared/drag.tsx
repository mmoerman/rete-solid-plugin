import { createEffect, onCleanup } from "solid-js";
import { Position } from "../types";

type Translate = (dx: number, dy: number) => void;
type StartEvent = { pageX: number; pageY: number };

export function useDrag(translate: Translate, getPointer: (e: StartEvent) => Position) {
  return {
    start(e: StartEvent) {
      let previous = { ...getPointer(e) };

      function move(moveEvent: MouseEvent) {
        const current = { ...getPointer(moveEvent) };
        const dx = current.x - previous.x;
        const dy = current.y - previous.y;

        previous = current;

        translate(dx, dy);
      }

      function up() {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
      }

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    },
  };
}

export function useNoDrag(el?: HTMLElement, disabled?: boolean) {
  createEffect(() => {
    const element = el;

    if (!element) return;

    const handleClick = (e: PointerEvent) => {
      if (disabled) return;

      // Using `getOwner` to determine the reactive ownership.
      const root = findRoot(e.target as HTMLElement);

      if (root) {
        e.stopPropagation();

        // Manually create a new event as a copy of the original event
        const eventCopy = new PointerEvent(e.type, e);
        root.dispatchEvent(eventCopy);
      }
    };

    element.addEventListener("pointerdown", handleClick);

    onCleanup(() => {
      element.removeEventListener("pointerdown", handleClick);
    });
  });
}

export function NoDrag(props: { children: any; disabled?: boolean }) {
  let ref: HTMLSpanElement | undefined;

  useNoDrag(ref, props.disabled);

  return (
      <span ref={(el) => (ref = el)}>
        {props.children}
      </span>);
}

function findRoot(el: HTMLElement) {
  let current: HTMLElement | null = el;

  while (current) {
    if (current.id === "root")
      return current
    current = current.parentElement;
  }
  return null;
}