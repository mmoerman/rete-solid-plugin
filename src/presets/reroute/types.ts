import { ConnectionId } from 'rete';

import { RenderSignal } from '../../types';

export type Position = {
  x: number
  y: number
}

export type Translate = (id: string, dx: number, dy: number) => void

export type PinInfo = {
  id: string
  position: Position
  selected?: boolean
}
export type PinData = {
  id: ConnectionId
  pins: PinInfo[]
}

export type PinsRender =
  | RenderSignal<'reroute-pins', { data: PinData }>
