import { Component, Show } from 'solid-js'
import { styled } from 'solid-styled-components'
import { ClassicScheme } from '../types'
import { useConnection } from './ConnectionWrapper'

const StyledSvg = styled('svg')`
    overflow: visible !important;
    position: absolute;
    pointer-events: none;
    width: 9999px;
    height: 9999px;
`

const StyledPath = styled('path')<{ styles?: (props: any) => any }>`
    fill: none;
    stroke-width: 5px;
    stroke: steelblue;
    pointer-events: auto;
    ${props => props.styles?.(props)}
`

type ConnectionProps = {
    data: ClassicScheme['Connection'] & { isLoop?: boolean }
    styles?: () => any
}

export const Connection: Component<ConnectionProps> = (props) => {
    const { path } = useConnection()

    return (
        <Show when={path}>
            <StyledSvg data-testid="connection">
                <StyledPath
                    styles={props.styles}
                    d={path?.()}
                />
            </StyledSvg>
        </Show>
    )
}
