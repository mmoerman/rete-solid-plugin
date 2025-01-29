import { Component } from 'solid-js'
import { styled } from 'solid-styled-components'
import { ComponentType } from '../types'

const SearchInput = styled('input')`
  color: white;
  padding: 1px 8px;
  border: 1px solid white;
  border-radius: 10px;
  font-size: 16px;
  font-family: serif;
  width: 100%;
  box-sizing: border-box;
  background: transparent;
`

type SearchProps = {
    value: string
    onChange: (value: string) => void
    component?: ComponentType
}

export const Search: Component<SearchProps> = (props) => {
    const SearchComponent = props.component || SearchInput

    return (
        <SearchComponent
            value={props.value}
            onInput={(e: InputEvent) => {
                props.onChange((e.target as HTMLInputElement).value)
            }}
            onPointerDown={(e: PointerEvent) => {
                e.stopPropagation()
            }}
            data-testid="context-menu-search-input"
        />
    )
}