import { Component } from 'solid-js'
import { styled } from 'solid-styled-components'
import { px } from '../utils'

const StyledMiniNode = styled('div')`
    position: absolute;
    background: rgba(110, 136, 255, 0.8);
    border: 1px solid rgb(192 206 212 / 60%);
`

type MiniNodeProps = {
    left: number
    top: number
    width: number
    height: number
}

export const MiniNode: Component<MiniNodeProps> = (props) => {
    return (
        <StyledMiniNode
            style={{
                left: px(props.left),
                top: px(props.top),
                width: px(props.width),
                height: px(props.height)
            }}
            data-testid="minimap-node"
        />
    )
}