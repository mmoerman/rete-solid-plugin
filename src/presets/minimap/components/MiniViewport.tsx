import { Component } from 'solid-js'
import { styled } from 'solid-styled-components'
import { useDrag } from '../../../shared/drag'
import { Rect, Transform, Translate } from '../types'
import { px } from '../utils'

const StyledMiniViewport = styled('div')`
  position: absolute;
  background: rgba(255, 251, 128, 0.32);
  border: 1px solid #ffe52b;
`

type MiniViewportProps = Rect & {
    containerWidth: number
    start: () => Transform
    translate: Translate
}

export const MiniViewport: Component<MiniViewportProps> = (props) => {
    const scale = (v: number) => v * props.containerWidth
    const invert = (v: number) => v / props.containerWidth

    const drag = useDrag(
        (dx: number, dy: number) => {
            props.translate(invert(-dx), invert(-dy))
        },
        (e: {pageX: number, pageY: number}) => ({ x: e.pageX, y: e.pageY })
    )

    return (
        <StyledMiniViewport
            onPointerDown={(e: PointerEvent) => drag.start(e)}
            style={{
                left: px(scale(props.left)),
                top: px(scale(props.top)),
                width: px(scale(props.width)),
                height: px(scale(props.height))
            }}
            data-testid="minimap-viewport"
        />
    )
}