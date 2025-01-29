import { JSX, Component } from "solid-js";
import { RenderSignal } from "../../types";

export type Item = {
  label: string;
  key: string;
  handler(): void;
  subitems?: Item[];
};

export type ContextMenuRender =
    | RenderSignal<"contextmenu", { items: Item[]; onHide(): void; searchBar?: boolean }>;

export type ComponentType = Component<JSX.HTMLAttributes<any>>;

export type Customize = {
  main?: () => ComponentType;
  item?: (item: Item) => ComponentType;
  search?: () => ComponentType;
  common?: () => ComponentType;
  subitems?: (item: Item) => ComponentType;
};
