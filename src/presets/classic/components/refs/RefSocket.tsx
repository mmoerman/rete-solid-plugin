import { ClassicPreset, NodeId } from 'rete';

import { RefComponent } from '../../../../ref-component';
import { ClassicScheme, GetSockets, SolidArea2D, Side } from '../../types';

type Props<Scheme extends ClassicScheme> = {
    name: string;
    emit: (props: SolidArea2D<Scheme>) => void;
    side: Side;
    nodeId: NodeId;
    socketKey: string;
    payload: ClassicPreset.Socket;
};

export const RefSocket = <Scheme extends ClassicScheme>(props: Props<Scheme>) => {
    const { name, emit, nodeId, side, socketKey, payload, ...rest } = props;

    return (
        <RefComponent
            {...rest}
            className={name}
            init={(ref) => {
                emit({
                    type: 'render',
                    data: {
                        type: 'socket',
                        side,
                        key: socketKey,
                        nodeId,
                        element: ref,
                        payload: payload as GetSockets<Scheme['Node']>,
                    },
                });
            }}
            unmount={(ref) => {
                emit({ type: 'unmount', data: { element: ref } });
            }}
        />
    );
};