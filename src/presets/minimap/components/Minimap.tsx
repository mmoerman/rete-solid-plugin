import { Component, createSignal, onMount, onCleanup, For } from 'solid-js'
import { styled } from 'solid-styled-components'
import { Rect, Transform, Translate } from '../types'
import { px } from '../utils'
import { MiniNode } from './MiniNode'
import { MiniViewport } from './MiniViewport'

const StyledMinimap = styled('div')<{ size: number }>`
    position: absolute;
    right: 24px;
    bottom: 24px;
    background: rgba(229, 234, 239, 0.65);
    padding: 20px;
    overflow: hidden;
    border: 1px solid #b1b7ff;
    border-radius: 8px;
    box-sizing: border-box;
`

type MinimapProps = {
    size: number
    ratio: number
    nodes: Rect[]
    viewport: Rect
    start: () => Transform
    translate: Translate
    point: (x: number, y: number) => void
}

export const Minimap: Component<MinimapProps> = (props) => {
    let ref: HTMLDivElement | undefined
    const [containerWidth, setContainerWidth] = createSignal(0)

    // Create resize observer
    onMount(() => {
        if (!ref) return

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width)
            }
        })

        resizeObserver.observe(ref)

        onCleanup(() => {
            resizeObserver.disconnect()
        })
    })

    // Scale function using containerWidth signal
    const scale = (v: number) => v * containerWidth()

    const handleDoubleClick = (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (!ref) return

        const box = ref.getBoundingClientRect()
        const x = (e.clientX - box.left) / (props.size * props.ratio)
        const y = (e.clientY - box.top) / (props.size * props.ratio)
        props.point(x, y)
    }

    const handlePointerDown = (e: PointerEvent) => {
        e.stopPropagation()
        e.preventDefault()
    }

    return (
        <StyledMinimap
            size={props.size}
            style={{
                width: px(props.size * props.ratio),
                height: px(props.size)
            }}
            onPointerDown={handlePointerDown}
            onDblClick={handleDoubleClick}
            ref={ref}
            data-testid="minimap"
        >
            {containerWidth() > 0 && (
                <For each={props.nodes}>
                    {(node, i) => (
                        <MiniNode
                            left={scale(node.left)}
                            top={scale(node.top)}
                            width={scale(node.width)}
                            height={scale(node.height)}
                        />
                    )}
                </For>
            )}
            <MiniViewport
                {...props.viewport}
                start={props.start}
                containerWidth={containerWidth()}
                translate={props.translate}
            />
        </StyledMinimap>
    )
}
