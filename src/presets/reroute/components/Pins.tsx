import { Component, For } from 'solid-js';
import { PinInfo } from '../types';
import { GetPointer } from "../../../shared/drag";
import { Pin } from "./Pin";

type PinsProps = {
  pins: PinInfo[];
  onMenu: (id: string) => void;
  onTranslate: (id: string, dx: number, dy: number) => void;
  onDown: (id: string) => void;
  getPointer: GetPointer;
};

export const Pins: Component<PinsProps> = (props) => {
  return (
    <div class="pins" style={{display: 'flex', 'flex-direction': 'column'}}>
      <For each={props.pins}>
        {(pin) => (
          <Pin
            position={pin.position}
            selected={pin.selected ?? false}
            getPointer={props.getPointer}
            onMenu={() => props.onMenu(pin.id)}
            onTranslate={(dx: number, dy: number) => props.onTranslate(pin.id, dx, dy)}
            onDown={() => props.onDown(pin.id)}
          ></Pin>
        )}
      </For>
    </div>
  );
};
