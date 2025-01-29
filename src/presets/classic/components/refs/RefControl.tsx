import { ClassicPreset } from 'rete';

import { RefComponent } from '../../../../ref-component';
import { ClassicScheme, GetControls, SolidArea2D } from '../../types';

type Props<Scheme extends ClassicScheme> = {
    name: string;
    emit: (props: SolidArea2D<Scheme>) => void;
    payload: ClassicPreset.Control;
};

export const RefControl = <Scheme extends ClassicScheme>(props: Props<Scheme>) => {
    const { name, emit, payload, ...rest } = props;

    return (
        <RefComponent
            {...rest}
            className={name}
            init={(ref) => {
                emit({
                    type: 'render',
                    data: {
                        type: 'control',
                        element: ref,
                        payload: payload as GetControls<Scheme['Node']>,
                    },
                });
            }}
            unmount={(ref) => {
                emit({ type: 'unmount', data: { element: ref } });
            }}
        />
    );
};
