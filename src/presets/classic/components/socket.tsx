import { Component } from 'solid-js'
import { ClassicPreset } from 'rete'
import { styled } from 'solid-styled-components'
import { $socketcolor, $socketmargin, $socketsize } from '../vars'

const StyledSocket = styled('div')`
    display: inline-block;
    cursor: pointer;
    border: 1px solid white;
    border-radius: ${String($socketsize / 2.0)}px;
    width: ${String($socketsize)}px;
    height: ${String($socketsize)}px;
    vertical-align: middle;
    background: ${$socketcolor};
    z-index: 2;
    box-sizing: border-box;
    &:hover {
      border-width: 4px;
    }
    &.multiple {
      border-color: yellow;
    }
`

const HoverableWrapper = styled('div')`
    border-radius: ${String(($socketsize + $socketmargin * 2) / 2.0)}px;
    padding: ${String($socketmargin)}px;
    &:hover {
      border-width: 4px;
    }
`

type SocketProps<T extends ClassicPreset.Socket> = {
    data: T
}

export const Socket: Component<SocketProps<ClassicPreset.Socket>> = (props) => {
    return (
        <HoverableWrapper>
            <StyledSocket title={props.data.name} />
        </HoverableWrapper>
    )
}