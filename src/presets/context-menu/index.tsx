import { BaseSchemes } from 'rete';
import { RenderPreset } from '../types';
import { BlockElement } from './components/Block';
import { ItemElement } from './components/Item';
import { MenuElement } from './components/Menu';
import { SearchElement } from './components/Search';
import { ContextMenuRender } from './types';
import { customElement } from "solid-element";
import { JSXElement } from "solid-js";

customElement('rete-context-menu', MenuElement);
customElement('rete-context-menu-block', BlockElement);
customElement('rete-context-menu-search', SearchElement);
customElement('rete-context-menu-item', ItemElement);

/**
 * Preset for rendering context menu.
 */
export function setup<Schemes extends BaseSchemes, K extends ContextMenuRender>(props?: {
  delay?: number
}): RenderPreset<Schemes, K> {
  const delay = typeof props?.delay === 'undefined'
    ? 1000
    : props.delay;

  return {
    update(context) {
      if (context.data.type === 'contextmenu') {
        return {
          items: context.data.items,
          delay,
          searchBar: context.data.searchBar,
          onHide: context.data.onHide
        };
      }
    },
    render(context): JSXElement {
      if (context.data.type === 'contextmenu') {
        return (
          <MenuElement
            items={context.data.items}
            delay={delay}
            searchBar={context.data.searchBar}
            onHide={context.data.onHide}
          ></MenuElement>
        );
      }
    }
  };
}
