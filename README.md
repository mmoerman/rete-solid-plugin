# Rete SolidJS Plugin
***

This is a Rete plugin for the [SolidJS](https://www.solidjs.com/) front-end framework.
It was inpired by the plugins already created for Rete by the Rete team, more specifically the 
[Rete React plugin](https://github.com/retejs/react-plugin)

The plugin uses the following to dependencies

- [solid-js](https://www.npmjs.com/package/solid-js): Base SolidJS framework
- [solid-styled-components](https://www.npmjs.com/package/solid-styled-components): Used to create easily styled 
components like react's styled-compnents

The library is in its Alpha stage, I am not a guru in SolidJS development, so I used some AI help and some 
reasearch to get this done.
I've been converting some of the examples at https://retejs.org/examples to test whether my code is working
and so far seems to work.
To create a SolidJS implementation of some of the examples found there, simply replace <b>ReactArea2D</b> with
<b>SolidArea2D</b> and <b>ReactPlugin</b> with <b>SolidPlugin</b> this should do it for most cases.

Here is a simple code example:
```tsx
import { createEffect, onCleanup, Component, createRoot } from "solid-js";
import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
    ConnectionPlugin,
    Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { SolidPlugin, Presets, SolidArea2D } from "./rete-plugin";

type Schemes = GetSchemes<
    ClassicPreset.Node,
    ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = SolidArea2D<Schemes>;

export const ReteEditor: Component = () => {
    let containerRef: HTMLDivElement | undefined;

    createEffect(() => {
        if (!containerRef) return;

        // Initialize createEditor function with the container
        createEditor(containerRef).then((editorInstance) => {
            // Cleanup: Destroy the editor instance when the component unmounts
            onCleanup(() => {
                editorInstance.destroy();
            });
        });
    });

    return (
        <div ref={(el) => (containerRef = el)}
            style={{ width: "100%", height: "100vh", border: "1px solid #ccc" }}
        >
        </div>
    );
};

async function createEditor(container: HTMLElement) {
    const socket = new ClassicPreset.Socket("socket");

    const editor = new NodeEditor<Schemes>();
    const area = new AreaPlugin<Schemes, AreaExtra>(container);
    const connection = new ConnectionPlugin<Schemes, AreaExtra>();
    const render = new SolidPlugin<Schemes, AreaExtra>();

    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    render.addPreset(Presets.classic.setup());

    connection.addPreset(ConnectionPresets.classic.setup());

    editor.use(area);
    area.use(connection);
    area.use(render);

    AreaExtensions.simpleNodesOrder(area);

    const a = new ClassicPreset.Node("A");
    a.addControl("a", new ClassicPreset.InputControl("text", { initial: "a" }));
    a.addOutput("a", new ClassicPreset.Output(socket));
    await editor.addNode(a);

    const b = new ClassicPreset.Node("B");
    b.addControl("b", new ClassicPreset.InputControl("text", { initial: "b" }));
    b.addInput("b", new ClassicPreset.Input(socket));
    await editor.addNode(b);

    await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));

    await area.translate(a.id, { x: 0, y: 0 });
    await area.translate(b.id, { x: 270, y: 0 });

    setTimeout(() => {
        // wait until nodes rendered because they don't have predefined width and height
        AreaExtensions.zoomAt(area, editor.getNodes());
    }, 10);

    // Return a cleanup function
    return {
        destroy: () => area.destroy(),
    };
}

export default ReteEditor;
```

### WARNING: This is BETA code, make sure to thoroughly test if you plan to use in a production environment.
