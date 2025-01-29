import { ClassicPreset, Scope } from "rete";
import {
  classicConnectionPath,
  getDOMSocketPosition,
  loopConnectionPath,
  SocketPositionWatcher,
} from "rete-render-utils";

import { Position } from "../../types";
import { RenderPreset } from "../types";
import { Connection } from "./components/Connection";
import { ConnectionWrapper } from "./components/ConnectionWrapper";
import { InputControl} from "./components/Control";
import { Node } from "./components/Node";
import { Socket } from "./components/Socket";
import {
  ClassicScheme,
  ExtractPayload,
  RenderEmit,
  SolidArea2D,
} from "./types";
import { AcceptComponent } from "./utility-types";
import {SolidPlugin} from "../../index";

export { Connection } from "./components/Connection";
export { useConnection } from "./components/ConnectionWrapper";
export { InputControl, Control } from "./components/Control";
export { Node, NodeStyles } from "./components/Node";
export { RefControl } from "./components/refs/RefControl";
export { RefSocket } from "./components/refs/RefSocket";
export { Socket } from "./components/Socket";
export type { ClassicScheme, SolidArea2D, RenderEmit } from "./types";

type CustomizationProps<Schemes extends ClassicScheme> = {
  node?: (
      data: ExtractPayload<Schemes, "node">
  ) => AcceptComponent<
      typeof data["payload"],
      { emit: RenderEmit<Schemes> }
  > | null;
  connection?: (
      data: ExtractPayload<Schemes, "connection">
  ) => AcceptComponent<typeof data["payload"]> | null;
  socket?: (
      data: ExtractPayload<Schemes, "socket">
  ) => AcceptComponent<typeof data["payload"]> | null;
  control?: (
      data: ExtractPayload<Schemes, "control">
  ) => AcceptComponent<typeof data["payload"]> | null;
};

type ClassicProps<Schemes extends ClassicScheme, K> = {
  socketPositionWatcher?: SocketPositionWatcher<Scope<never, [K]>>;
  customize?: CustomizationProps<Schemes>;
};

/**
 * Classic preset for rendering nodes, connections, controls, and sockets using SolidJS.
 */
export function setup<Schemes extends ClassicScheme, K extends SolidArea2D<Schemes>>(
    props?: ClassicProps<Schemes, K>
): RenderPreset<Schemes, K> {
  const positionWatcher =
      typeof props?.socketPositionWatcher === "undefined"
          ? getDOMSocketPosition<Schemes, K>()
          : props.socketPositionWatcher;

  const { node, connection, socket, control } = props?.customize || {};

  function executeRender(context: Extract<K, { type: 'render' }>, plugin: SolidPlugin<Schemes, K>) {
    if (context.data.type === "node") {
      const parent = plugin.parentScope();
      const NodeComponent = (node ? node(context.data) : Node) as typeof Node;

      return(
          NodeComponent && (
              <NodeComponent
                  data={context.data.payload}
                  emit={(data) => void parent.emit(data as any)}
              />
          )
      )
    } else if (context.data.type === "connection") {
      const ConnectionComponent = (connection ? connection(context.data) : Connection) as typeof Connection;
      const payload = context.data.payload;
      const { sourceOutput, targetInput, source, target } = payload;

      return (
          ConnectionComponent && (
              <ConnectionWrapper
                  start={
                      context.data.start ||
                      ((change) =>
                          positionWatcher.listen(source, "output", sourceOutput, change))
                  }
                  end={
                      context.data.end ||
                      ((change) =>
                          positionWatcher.listen(target, "input", targetInput, change))
                  }
                  path={async (start, end) => {
                    type FixImplicitAny = typeof plugin.__scope.produces | undefined;
                    const response: FixImplicitAny = await plugin.emit({
                      type: "connectionpath",
                      data: {
                        payload,
                        points: [start, end],
                      },
                    });

                    if (!response) return "";

                    const { path, points } = response.data;
                    const curvature = 0.3;

                    if (!path && points.length !== 2)
                      throw new Error(
                          "cannot render connection with a custom number of points"
                      );
                    if (!path)
                      return payload.isLoop
                          ? loopConnectionPath(points as [Position, Position], curvature, 120)
                          : classicConnectionPath(points as [Position, Position], curvature);

                    return path;
                  }}
              >
                <ConnectionComponent data={context.data.payload} />
              </ConnectionWrapper>
          )
      );
    } else if (context.data.type === "socket") {
      const SocketComponent = (socket ? socket(context.data) : Socket) as typeof Socket;

      return SocketComponent &&
          context.data.payload && <SocketComponent data={context.data.payload} />;
    } else if (context.data.type === "control") {
      const ControlComponent =
          control && context.data.payload
              ? control(context.data)
              : context.data.payload instanceof ClassicPreset.InputControl
                  ? InputControl
                  : null;

      return ControlComponent && <ControlComponent data={context.data.payload as any} />;
    }
  }

  const supportedTypes = ["node", "connection", "socket", "control"];

  return {
    attach(plugin) {
      positionWatcher.attach(plugin as unknown as Scope<never, [K]>);
    },
    render(context, plugin) {
      if (supportedTypes.includes(context.data.type))
        return () => executeRender(context, plugin);
    },
  };
}
