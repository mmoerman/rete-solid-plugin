import { ConnectionId } from 'rete'

import { Position, RenderSignal } from '../../types'

export type PinType = {
  id: string
  position: Position
  selected?: boolean
}
export type PinData = {
  id: ConnectionId
  pins: PinType[]
}

export type PinsRender =
    | RenderSignal<'reroute-pins', { data: PinData }>