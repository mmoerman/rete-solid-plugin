import { Component, ParentProps } from "solid-js";

export const BlockElement: Component = (props: ParentProps) => {
  return (
    <div
      style={{
        "color": "#fff",
        "padding": "4px",
        "border-bottom": "1px solid var(--context-color-dark)",
        "background-color": "var(--context-color)",
        "cursor": "pointer",
        "box-sizing": "border-box",
        "width": "100%",
        "position": "relative",
        "display": "block",
      }}
      class="block-element"
    >
      {props.children}
      <style>
        {`
              .block-element:first-child {
                border-top-left-radius: var(--context-menu-round);
                border-top-right-radius: var(--context-menu-round);
              }
              .block-element:last-child {
                border-bottom-left-radius: var(--context-menu-round);
                border-bottom-right-radius: var(--context-menu-round);
              }
              .block-element:hover {
                background-color: var(--context-color-light);
              }
            `}
      </style>
    </div>
  );
};

