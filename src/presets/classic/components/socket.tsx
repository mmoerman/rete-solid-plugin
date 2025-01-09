import { JSXElement } from "solid-js";

interface SocketElementProps<T> {
  data: T | null;
}

export function SocketElement<T extends { name?: string }>(props: SocketElementProps<T>): JSXElement {
  console.log("Rendering SocketElement");

  return (
    <div
      class="hoverable"
      style={{
        "border-width": "1px",
        "border-radius": "calc((var(--socket-size) + var(--socket-margin) * 2) / 2)",
        "padding": "var(--socket-margin)",
      }}
    >
      <div
        class="styles"
        style={{
          "display": "inline-block",
          "cursor": "pointer",
          "border": "var(--border-width) solid white",
          "border-radius": "calc(var(--socket-size) / 2)",
          "width": "var(--socket-size)",
          "height": "var(--socket-size)",
          "vertical-align": "middle",
          "background": "var(--socket-color)",
          "z-index": 2,
          "box-sizing": "border-box",
        }}
        title={props.data?.name}
      />
    </div>
  );
}
