import { BaseSchemes } from 'rete';

import { SolidJSPlugin } from '..';
import { JSXElement } from "solid-js";

export type RenderPreset<Schemes extends BaseSchemes, T> = {
  attach?: (plugin: SolidJSPlugin<Schemes, T>) => void
  update: (context: Extract<T, {
    type: 'render'
  }>, plugin: SolidJSPlugin<Schemes, T>) => Record<string, unknown> | null | undefined
  render: (context: Extract<T, {
    type: 'render'
  }>, plugin: SolidJSPlugin<Schemes, T>) => JSXElement | null | undefined
}
