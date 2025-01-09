import { For, JSX, mergeProps, Show } from "solid-js";
import { ClassicScheme, RenderEmit } from "../types";
import { RefElement } from "./refs/ref";

interface NodeExtraData {
  width?: number;
  height?: number;
}

interface NodeElementProps<S extends ClassicScheme> {
  width?: number | null;
  height?: number | null;
  data: ClassicScheme["Node"] & NodeExtraData;
  styles?: (props: any) => JSX.CSSProperties | string;
  emit?: RenderEmit<S>;
}

export function NodeElement<S extends ClassicScheme>(props: NodeElementProps<S>) {
  props = mergeProps({width: null, height: null}, props);

  const computeStyles = () => {
    const {width, height} = props.data;
    const inlineStyles: JSX.CSSProperties = {
      width: Number.isFinite(width) ? `${width}px` : "var(--node-width)",
      height: Number.isFinite(height) ? `${height}px` : "auto",
    };
    return props.styles ? {...inlineStyles, ...(props.styles(props) as JSX.CSSProperties)} : inlineStyles;
  };

  const sortByIndex = <T extends [string, undefined | { index?: number }][]>(entries: T) => {
    return entries.sort((a, b) => {
      const ai = a[1]?.index || 0;
      const bi = b[1]?.index || 0;
      return ai - bi;
    });
  };

  const inputs = () => {
    const entries = Object.entries(props.data.inputs || {});
    return sortByIndex(entries);
  };

  const outputs = () => {
    const entries = Object.entries(props.data.outputs || {});
    return sortByIndex(entries);
  };

  const controls = () => {
    const entries = Object.entries(props.data.controls || {});
    return sortByIndex(entries);
  };

  return (
    <div
      class={`node-element ${props.data.selected ? "selected" : ""}`}
      data-testid="node"
      style={computeStyles()}
    >
      <div class="title" data-testid="title">
        {props.data.label}
      </div>

      {/* Outputs */}
      <For each={outputs()}>
        {([key, output]) => (
          <Show when={output}>
            <div class="output" id={key} data-testid={`output-${key}`}>
              <div class="output-title" data-testid="output-title">
                {output?.label}
              </div>
              <span class="output-socket" data-testid="output-socket">
                <RefElement
                  data={{
                    type: "socket",
                    side: "output",
                    key,
                    nodeId: props.data.id,
                    payload: output?.socket,
                  }}
                  emit={props.emit ? props.emit as RenderEmit<ClassicScheme> : undefined}
                ></RefElement>
              </span>
            </div>
          </Show>
        )}
      </For>

      {/* Controls */}
      <For each={controls()}>
        {([key, control]) => (
          <Show when={control}>
            <span class="control" data-testid={`control-${key}`}>
              <RefElement
                data={{
                  type: "control",
                  payload: control,
                }}
                emit={props.emit as RenderEmit<ClassicScheme>}
              ></RefElement>
            </span>
          </Show>
        )}
      </For>

      {/* Inputs */}
      <For each={inputs()}>
        {([key, input]) => (
          <Show when={input}>
            <div class="input" id={key} data-testid={`input-${key}`}>
              <span class="input-socket" data-testid="input-socket">
                <RefElement
                  data={{
                    type: "socket",
                    side: "input",
                    key,
                    nodeId: props.data.id,
                    payload: input?.socket,
                  }}
                  emit={props.emit as RenderEmit<ClassicScheme>}
                ></RefElement>
              </span>
              <Show when={(!input?.control || !input?.showControl)}>
                <div class="input-title" data-testid="input-title">
                  {input?.label}
                </div>
              </Show>
              <Show when={input?.control && input?.showControl}>
                <span class="control" data-testid="input-control">
                  <RefElement
                    data={{
                      type: "control",
                      payload: input?.control,
                    }}
                    emit={props.emit as RenderEmit<ClassicScheme>}
                  ></RefElement>
                </span>
              </Show>
            </div>
          </Show>
        )}
      </For>
    </div>
  );
}
