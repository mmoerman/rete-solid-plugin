import {Component, createMemo, onMount, ParentProps} from 'solid-js'
import { ClassicPreset } from 'rete'
import { styled } from 'solid-styled-components'
import { useNoDrag } from '../../../shared/drag'

const StyledInput = styled('input')<{ styles?: (props: any) => any }>`
    width: 100%;
    border-radius: 30px;
    background-color: white;
    padding: 2px 6px;
    border: 1px solid #999;
    font-size: 110%;
    box-sizing: border-box;
    ${props => props.styles?.(props)}
`

type ControlProps<N extends 'text' | 'number'> = {
    data: ClassicPreset.InputControl<N>
    styles?: () => any
}

export const Control: Component<ParentProps> = (props) => {
    let ref!: HTMLElement;

    // Apply no-drag behavior
    onMount(() => {
        if (ref) {
            useNoDrag(ref)
        }
    })

    return (
        <span ref={ref}>
            {props.children}
        </span>
    )

}

export const InputControl: Component<ControlProps<'text' | 'number'>> = <N extends 'text' | 'number'>(props: ControlProps<N>) => {
    // Create memo for value that tracks props.data.value
    const value = createMemo(() => props.data.value)

    const handleChange = (e: InputEvent) => {
        const target = e.target as HTMLInputElement
        const newValue = (props.data.type === 'number'
            ? +target.value
            : target.value) as typeof props.data['value']

        props.data.setValue(newValue)
    }

    return (
        <Control>
            <StyledInput
                value={value()}
                type={props.data.type}
                readOnly={props.data.readonly}
                onInput={handleChange}
                styles={props.styles}
            />
        </Control>
    )
}
