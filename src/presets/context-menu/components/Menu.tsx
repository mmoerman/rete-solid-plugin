import { createSignal, onCleanup, For } from 'solid-js'
import { styled } from 'solid-styled-components'
import { useDebounce } from '../hooks'
import { CommonStyle } from '../styles'
import { Customize, Item } from '../types'
import { $width } from '../vars'
import { ItemElement } from './Item'
import { Search } from './Search'

const StyledMenu = styled('div')`
  padding: 10px;
  width: ${String($width)}px;
  margin-top: -20px;
  margin-left: -${String($width / 2)}px;
`

type Props = {
  items: Item[]
  delay: number
  searchBar?: boolean
  onHide: () => void
  components?: Customize
}

export function Menu(props: Props) {
  const [hide, cancelHide] = useDebounce(props.onHide, props.delay)
  const [filter, setFilter] = createSignal('')

  const filteredList = () => {
    const filterRegexp = new RegExp(filter(), 'i')
    return props.items.filter(item => item.label.match(filterRegexp))
  }

  const MenuComponent = props.components?.main?.() || StyledMenu
  const CommonComponent = props.components?.common?.() || CommonStyle

  // Clean up any pending hide timeouts when component unmounts
  onCleanup(() => {
    cancelHide()
  })

  return (
      <MenuComponent
          onMouseOver={() => {
            cancelHide()
          }}
          onMouseLeave={() => hide?.()}
          onWheel={(e: WheelEvent) => {
            e.stopPropagation()
          }}
          data-testid="context-menu"
      >
        {props.searchBar && (
            <CommonComponent>
              <Search
                  value={filter()}
                  onChange={setFilter}
                  component={props.components?.search?.()}
              />
            </CommonComponent>
        )}
        <For each={filteredList()}>
          {(item) => (
              <ItemElement
                  data={item}
                  delay={props.delay}
                  hide={props.onHide}
                  components={props.components}
              >
                {item.label}
              </ItemElement>
          )}
        </For>
      </MenuComponent>
  )
}
