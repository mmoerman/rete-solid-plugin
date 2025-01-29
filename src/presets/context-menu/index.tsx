import { BaseSchemes } from 'rete'
import { RenderPreset } from '../types'
import { Menu } from './components/Menu'
import { ContextMenuRender, Customize } from './types'

// Re-exports from components
export { ItemStyle as Item, SubitemStyles as Subitems } from './components/Item'
export { Menu } from './components/Menu'
export { Search } from './components/Search'
export { CommonStyle as Common } from './styles'

type Props = {
  delay?: number
  customize?: Customize
}

export function setup<Schemes extends BaseSchemes, K extends ContextMenuRender>(props?: Props): RenderPreset<Schemes, K> {
  const delay = typeof props?.delay === 'undefined'
      ? 1000
      : props.delay

  return {
    render(context, _) {
      if (context.data.type === 'contextmenu') {
        return () => {
          return (
              <Menu
                  items={context.data.items}
                  delay={delay}
                  searchBar={context.data.searchBar}
                  onHide={context.data.onHide}
                  components={props?.customize}
              />
          );
        }
      }
    }
  }
}