import { Component } from 'solid-js'
import { styled } from 'solid-styled-components'
import { useDrag } from '../../../shared/drag'
import { Position } from '../../../types'
import { PinType } from '../types'
const pinSize = 20

const StyledPin = styled('div')<{ selected?: boolean }>`
  width: ${String(pinSize)}px;
  height: ${String(pinSize)}px;
  box-sizing: border-box;
  background: ${props => props.selected
    ? '#ffd92c'
    : 'steelblue'};
  border: 2px solid white;
  border-radius: ${String(pinSize)}px;
`

type PinProps = PinType & {
    contextMenu: () => void
    translate: (dx: number, dy: number) => void
    pointerdown: () => void
    pointer: () => Position
}

export const Pin: Component<PinProps> = (props) => {
    const drag = useDrag(
        (dx: number, dy: number) => {
            props.translate(dx, dy)
        },
        props.pointer
    )

    const handlePointerDown = (e: PointerEvent) => {
        e.stopPropagation()
        e.preventDefault()
        drag.start(e)
        props.pointerdown()
    }

    const handleContextMenu = (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        props.contextMenu()
    }

    return (
        <StyledPin
            selected={props.selected}
            onPointerDown={handlePointerDown}
            onContextMenu={handleContextMenu}
            style={{
                position: 'absolute',
                top: `${props.position.y - pinSize / 2}px`,
                left: `${props.position.x - pinSize / 2}px`
            }}
            data-testid="pin"
        />
    )
}
