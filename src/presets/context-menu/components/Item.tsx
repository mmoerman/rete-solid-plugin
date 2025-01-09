import { createSignal, For, onCleanup, ParentProps } from "solid-js";
import { debounce } from "../utils/debounce";

interface ItemElementProps extends ParentProps {
  subitems?: ItemElementProps[];
  delay?: number;
  onSelect?: (event: InputEvent) => void;
  onHide?: () => void;
  key?: string;
  label?: string;
  handler?: () => void;
}

export const ItemElement = (props: ItemElementProps) => {
  const [visibleSubitems, setVisibleSubitems] = createSignal(false);
  const delay = props.delay || 0;

  // Debounced function to hide subitems
  const hide = debounce(delay, () => setVisibleSubitems(false));

  // Cleanup on component unmount
  onCleanup(() => hide.cancel());

  // Event handlers
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    props.onSelect?.(event as unknown as InputEvent);
    props.onHide?.();
  };

  const stopEvent = (event: Event) => {
    event.stopPropagation();
  };

  const handlePointerOver = () => {
    hide.cancel();
    setVisibleSubitems(true);
  };

  const handlePointerLeave = () => {
    hide.call();
  };

  const handleHide = () => {
    props.onHide?.();
  };

  return (
    <div
      classList={{hasSubitems: !!props.subitems && props.subitems.length > 0}}
      data-testid="context-menu-item"
    >
      <div
        class="content"
        onClick={handleClick}
        onWheel={stopEvent}
        onPointerOver={handlePointerOver}
        onPointerLeave={handlePointerLeave}
        onPointerDown={stopEvent}
      >
        <div>{props.children}</div>
        {props.subitems && visibleSubitems() && (
          <div class="subitems">
            <For each={props.subitems}>
              {(item) => (
                <ItemElement
                  key={item.key}
                  delay={delay}
                  subitems={item.subitems}
                  onSelect={item.handler}
                  onHide={handleHide}
                >
                  {item.label}
                </ItemElement>
              )}
            </For>
          </div>
        )}
      </div>
      <style>
        {`
          .content {
            padding: 4px;
          }
          :global(.hasSubitems)::after {
            content: '►';
            position: absolute;
            opacity: 0.6;
            right: 5px;
            top: 5px;
            pointer-events: none;
          }
          .subitems {
            position: absolute;
            top: 0;
            left: 100%;
            width: var(--menu-width);
          }
        `}
      </style>
    </div>
  );
};
