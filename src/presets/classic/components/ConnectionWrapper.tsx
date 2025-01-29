import {Component, JSX, createContext, useContext, createSignal, onMount, onCleanup, createEffect, Accessor} from 'solid-js'
import { Position } from '../../../types'

export type ConnectionContextValue = {
  start?: () => Position | undefined
  end?: () => Position | undefined
  path?: Accessor<string | undefined>;
}

type PositionWatcher = (cb: (value: Position) => void) => (() => void)

type Props = {
  children: JSX.Element
  start: Position | PositionWatcher
  end: Position | PositionWatcher
  path: (start: Position, end: Position) => Promise<string | null>
}

const defaultContext: ConnectionContextValue = {
}

export const ConnectionContext = createContext<ConnectionContextValue>(defaultContext)

export const ConnectionWrapper: Component<Props> = (props) => {
  const [computedStart, setComputedStart] = createSignal<Position>()
  const [computedEnd, setComputedEnd] = createSignal<Position>()
  const [path, setPath] = createSignal<string>()

  const start = () => 'x' in props.start
      ? props.start
      : computedStart()

  const end = () => 'x' in props.end
      ? props.end
      : computedEnd()

  // Handle position watchers
  onMount(() => {
    let unwatch1: (() => void) | void
    let unwatch2: (() => void) | void

    if (typeof props.start === 'function') {
      unwatch1 = props.start((s: Position) => {
        setComputedStart(s)
      });
    }

    if (typeof props.end === 'function') {
      unwatch2 = props.end((s: Position) => {
        setComputedEnd(s)
      });
    }

    onCleanup(() => {
      if (unwatch1) unwatch1()
      if (unwatch2) unwatch2()
    })
  })

  // Handle path updates
  createEffect(() => {
    const s = start();
    const e = end();

    if (s && e) {
      void props.path(s, e).then(p => {
        if (p)
          setPath(p);
        else
          setPath(undefined);
      });
    }
  })

  const value = {
    get start() { return start },
    get end() { return end },
    get path() { return path }
  }

  return (
      <ConnectionContext.Provider value={value}>
        {props.children}
      </ConnectionContext.Provider>
  )
}

export function useConnection() {
  const context = useContext(ConnectionContext);

  if (!context)
    throw Error('useConnection must be used within a ConnectionContext provider')
  return context;
}
