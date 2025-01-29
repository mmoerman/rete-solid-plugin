import {Component, For} from 'solid-js'
import {styled} from 'solid-styled-components'
import {ClassicScheme, RenderEmit} from '../types'
import {$nodecolor, $nodecolorselected, $nodewidth, $socketmargin, $socketsize} from '../vars'
import {RefControl} from './refs/RefControl'
import {RefSocket} from './refs/RefSocket'

type NodeExtraData = {
  width?: number
  height?: number
}

export const NodeStyles = styled('div')<NodeExtraData & { selected: boolean, styles?: (props: any) => any }>`
    background: ${props => props.selected ? $nodecolorselected : $nodecolor};
    border-color: ${props => props.selected ? '#e3c000' : '#4e58bf'};
    border-style: solid;
    border-width: 2px;
    border-radius: 10px;
    cursor: pointer;
    box-sizing: border-box;
    width: ${props => Number.isFinite(props.width)
    ? `${props.width}px`
    : `${$nodewidth}px`};
    height: ${props => Number.isFinite(props.height)
    ? `${props.height}px`
    : 'auto'};
    padding-bottom: 6px;
    position: relative;
    user-select: none;
    line-height: initial;
    font-family: Arial;
    &:hover {
        filter: brightness(1.1);
    }
    .title {
        color: white;
        font-family: sans-serif;
        font-size: 18px;
        padding: 8px;
    }
    .output {
        text-align: right;
    }
    .input {
        text-align: left;
    }
    .output-socket {
        text-align: right;
        margin-right: -${String($socketsize / 2 + $socketmargin)}px;
        display: inline-block;
    }
    .input-socket {
        text-align: left;
        margin-left: -${String($socketsize / 2 + $socketmargin)}px;
        display: inline-block;
    }
    .input-title,.output-title {
        vertical-align: middle;
        color: white;
        display: inline-block;
        font-family: sans-serif;
        font-size: 14px;
        margin: ${String($socketmargin)}px;
        line-height: ${String($socketsize)}px;
    }
    .input-control {
        z-index: 1;
        width: calc(100% - ${String($socketsize + 2 * $socketmargin)}px);
        vertical-align: middle;
        display: inline-block;
    }
    .control {
        display: block;
        padding: ${String($socketmargin)}px ${String($socketsize / 2 + $socketmargin)}px;
    }
    ${props => props.styles?.(props)}
`

function sortByIndex<T extends [string, undefined | { index?: number }][]>(entries: T) {
  entries.sort((a, b) => {
    const ai = a[1]?.index || 0
    const bi = b[1]?.index || 0
    return ai - bi
  })
}

type Props<S extends ClassicScheme> = {
  data: S['Node'] & NodeExtraData
  styles?: () => any
  emit: RenderEmit<S>
}

export type NodeComponent<Scheme extends ClassicScheme> = Component<Props<Scheme>>

export const Node: Component<Props<ClassicScheme>> = <Scheme extends ClassicScheme>(props: Props<Scheme>) => {
  const inputs = Object.entries(props.data.inputs)
  const outputs = Object.entries(props.data.outputs)
  const controls = Object.entries(props.data.controls)

  // Sort the entries
  sortByIndex(inputs)
  sortByIndex(outputs)
  sortByIndex(controls)

  const selected = () => props.data.selected || false
  const { id, label, width, height } = props.data

  return (
      <NodeStyles
          selected={selected()}
          width={width}
          height={height}
          styles={props.styles}
          data-testid="node"
      >
        <div class="title" data-testid="title">{label}</div>

        {/* Outputs */}
        <For each={outputs}>
          {([key, output]) => output && (
              <div class="output" data-testid={`output-${key}`}>
                <div class="output-title" data-testid="output-title">{output.label}</div>
                <RefSocket
                    name="output-socket"
                    side="output"
                    socketKey={key}
                    nodeId={id}
                    emit={props.emit}
                    payload={output.socket}
                    data-testid="output-socket"
                />
              </div>
          )}
        </For>

        {/* Controls */}
        <For each={controls}>
          {([key, control]) => control && (
              <RefControl
                  name="control"
                  emit={props.emit}
                  payload={control}
                  data-testid={`control-${key}`}
              />
          )}
        </For>

        {/* Inputs */}
        <For each={inputs}>
          {([key, input]) => input && (
              <div class="input" data-testid={`input-${key}`}>
                <RefSocket
                    name="input-socket"
                    side="input"
                    socketKey={key}
                    nodeId={id}
                    emit={props.emit}
                    payload={input.socket}
                    data-testid="input-socket"
                />
                {input && (!input.control || !input.showControl) && (
                    <div class="input-title" data-testid="input-title">{input.label}</div>
                )}
                {input.control && input.showControl && (
                    <RefControl
                        name="input-control"
                        emit={props.emit}
                        payload={input.control}
                        data-testid="input-control"
                    />
                )}
              </div>
          )}
        </For>
      </NodeStyles>
  )
}
