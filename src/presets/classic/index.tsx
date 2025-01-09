import { Scope } from 'rete';
import {
  classicConnectionPath,
  getDOMSocketPosition,
  loopConnectionPath,
  SocketPositionWatcher
} from 'rete-render-utils';

import { Requires } from '../..';
import { RefElement } from './components/refs/ref';
import { Position } from '../../types';
import { RenderPreset } from '../types';
import { ConnectionElement } from './components/connection';
import { ConnectionWrapperElement } from './components/connection-wrapper';
import { ControlElement } from './components/control';
import { NodeElement } from './components/node';
import { SocketElement } from './components/socket';
import { ClassicScheme, ExtractPayload, RenderEmit, SolidArea2D } from './types';
import { customElement } from "solid-element";
import { JSXElement } from "solid-js";

export type { ClassicScheme, SolidArea2D, RenderEmit } from './types'


customElement('rete-connection-wrapper', ConnectionWrapperElement);
customElement('rete-connection', ConnectionElement);
customElement('rete-ref', RefElement);
customElement('rete-socket', SocketElement);
customElement('rete-node', NodeElement);
customElement('rete-control', ControlElement);

type CustomizationProps<Schemes extends ClassicScheme> = {
  node?: (data: ExtractPayload<Schemes, 'node'>) => ((props: { emit: RenderEmit<Schemes> }) => JSXElement | null)
  connection?: (data: ExtractPayload<Schemes, 'connection'>) => ((props: {
    path: string
    start: Position
    end: Position
  }) => JSXElement | null)
  socket?: (data: ExtractPayload<Schemes, 'socket'>) => (() => JSXElement | null)
  control?: (data: ExtractPayload<Schemes, 'control'>) => () => (JSXElement | null)
}
type OnChange = (data: Position) => void

type ClassicProps<Schemes extends ClassicScheme, K> = {
  socketPositionWatcher?: SocketPositionWatcher<Scope<never, [K]>>
  customize?: CustomizationProps<Schemes>
}

/**
 * Classic preset for rendering nodes, connections, controls and sockets.
 */
export function setup<Schemes extends ClassicScheme, K extends SolidArea2D<Schemes>>(props?: ClassicProps<Schemes, K>): RenderPreset<Schemes, K> {
  const positionWatcher = typeof props?.socketPositionWatcher === 'undefined'
    ? getDOMSocketPosition<Schemes, K>()
    : props.socketPositionWatcher;
  const {node, connection, socket, control} = props?.customize || {};

  return {
    attach(plugin) {
      positionWatcher.attach(plugin as unknown as Scope<never, [K]>);
    },
    update(context, plugin) {
      const {payload} = context.data;
      const parent = plugin.parentScope();

      if (!parent) throw new Error('parent');
      const emit = parent.emit.bind(parent);

      if (context.data.type === 'node') {
        return {data: payload, emit};
      } else if (context.data.type === 'connection') {
        const {start, end} = context.data;

        return {
          data: payload,
          ...start
            ? {start}
            : {},
          ...end
            ? {end}
            : {}
        };
      }
      return {data: payload};
    },
    // eslint-disable-next-line max-statements
    render(context, plugin): JSXElement {
      if (context.data.type === 'node') {
        const parent = plugin.parentScope();
        const emit: RenderEmit<Schemes> = (data): void => {
          parent.emit(data as Requires<Schemes>);
        };

        return node
          ? node(context.data)({emit})
          : <NodeElement data={context.data.payload} emit={emit as RenderEmit<ClassicScheme>}></NodeElement>;
      }
      if (context.data.type === 'connection') {
        const data = context.data;
        const payload = data.payload;
        const {sourceOutput, targetInput, source, target} = payload;
        const component = (path: string | null, start: Position | null, end: Position | null): JSXElement => {
          return connection
            ? connection(data)({path: path ?? '', start: start ?? {x: 0, y: 0}, end: end ?? {x: 0, y: 0}})
            : <ConnectionElement path={path ?? ""} start={start ?? {x: 0, y: 0}}
                                 end={end ?? {x: 0, y: 0}}></ConnectionElement>;
        };

        return (
          <ConnectionWrapperElement
            start={context.data.start || ((change: OnChange) => positionWatcher.listen(source, 'output', sourceOutput, change))}
            end={context.data.end || ((change: OnChange) => positionWatcher.listen(target, 'input', targetInput, change))}
            path={async (start: Position, end: Position) => {
              const response = await plugin.emit({
                type: 'connectionpath',
                data: {
                  payload,
                  points: [start, end]
                }
              });

              if (!response)
                return '';

              const {path, points} = response.data;
              const curvature = 0.3;

              if (!path && points.length !== 2) throw new Error('cannot render connection with a custom number of points');
              if (!path) return payload.isLoop
                ? loopConnectionPath(points as [Position, Position], curvature, 120)
                : classicConnectionPath(points as [Position, Position], curvature);

              return path;
            }}
            component={component}
          />
        );
      } else if (context.data.type === 'socket') {
        return socket
          ? socket(context.data)()
          : <SocketElement data={context.data.payload}/>;
      } else if (context.data.type === 'control') {
        return control
          ? control(context.data)()
          : <ControlElement data={context.data.payload}/>;
      }
      return null;
    }
  };
}
