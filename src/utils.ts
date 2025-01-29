import { Component, JSX, onCleanup, createSignal, createEffect, createMemo } from 'solid-js'

export const Root: Component<{
    children: JSX.Element | null
    rendered: () => void
}> = (props) => {
    createEffect(() => {
        props.rendered()
    })

    return props.children
}

export function useRete<T extends { destroy(): void }>(create: (el: HTMLElement) => Promise<T>) {
    const [container, setContainer] = createSignal<HTMLElement | null>(null);
    let editorInstance: T | undefined
    let ref: HTMLElement | null = null

    // Create memo for editor instance
    const editor = createMemo(() => {
        const currentContainer = container()
        if (currentContainer) {
            if (editorInstance) {
                editorInstance.destroy()
                currentContainer.innerHTML = ''
            }
            create(currentContainer).then(value => {
                editorInstance = value
            })
        }
        return editorInstance || null
    })

    // Cleanup on unmount
    onCleanup(() => {
        if (editorInstance) {
            editorInstance.destroy()
        }
    })

    // Setup ref callback
    const setRef = (element: HTMLElement) => {
        ref = element
        setContainer((_) => element)
    }

    return [setRef, editor] as const
}
