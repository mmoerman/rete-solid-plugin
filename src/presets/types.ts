import { BaseSchemes } from 'rete';
import { JSX } from 'solid-js';

import { SolidPlugin } from '..';

export type RenderPreset<Schemes extends BaseSchemes, T> = {
  attach?: (plugin: SolidPlugin<Schemes, T>) => void
  render: (context: Extract<T, { type: 'render' }>, plugin: SolidPlugin<Schemes, T>) => (() => JSX.Element) | null | undefined
}