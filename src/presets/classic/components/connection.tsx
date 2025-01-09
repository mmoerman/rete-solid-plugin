import { Component } from "solid-js";
import { Position } from "../../../types";

interface ConnectionProps {
  start: Position;
  end: Position;
  path: string;
}

export const ConnectionElement: Component<ConnectionProps> = (props) => {
  return (
    <svg
      data-testid="connection"
      style={{
        "overflow": "visible",
        "position": "absolute",
        "pointer-events": "none",
        "width": "9999px",
        "height": "9999px",
      }}
    >
      <path
        d={props.path}
        style={{
          "fill": "none",
          "stroke-width": "5px",
          "stroke": "steelblue",
          "pointer-events": "auto",
        }}
      ></path>
    </svg>
  );
};
