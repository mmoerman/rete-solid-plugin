import { createEffect, createSignal, For, onCleanup } from "solid-js";
import { debounce } from "../utils/debounce";

interface Item {
  key: string;
  label: string;
  handler: () => void;
  subitems?: Item[];
}

interface MenuElementProps {
  items: Item[];
  delay?: number;
  searchBar?: boolean;
  onHide?: () => void;
}

export const MenuElement = (props: MenuElementProps) => {
  const [filter, setFilter] = createSignal("");
  const [filteredItems, setFilteredItems] = createSignal<Item[]>(props.items || []);
  const delay = props.delay || 0;
  const hide = debounce(delay, () => props.onHide?.());

  // Track mouse events for hiding the menu
  const handleMouseOver = () => hide.cancel();
  const handleMouseLeave = () => hide.call();

  // Filter items based on the search input
  createEffect(() => {
    const filterRegexp = new RegExp(filter(), "i");
    setFilteredItems(props.items.filter((item) => filterRegexp.test(item.label)));
  });

  // Cleanup the debounce logic when the component is unmounted
  onCleanup(() => hide.cancel());

  const handleFilterChange = (event: InputEvent) => {
    setFilter((event.target as HTMLInputElement).value);
  };

  return (
    <div
      class="menu"
      data-testid="context-menu"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <style>
        {`
          :host {
            --context-color: rgba(110, 136, 255, 0.8);
            --context-color-light: rgba(130, 153, 255, 0.8);
            --context-color-dark: rgba(69, 103, 255, 0.8);
            --context-menu-round: 5px;
            --menu-width: 120px;
          }
          .menu {
            padding: 10px;
            width: var(--menu-width);
            margin-top: -20px;
            margin-left: calc(-1 * var(--menu-width) / 2);
          }
        `}
      </style>
      {props.searchBar && (
        <div>
          <div>
            <input
              type="text"
              value={filter()}
              onInput={handleFilterChange}
              placeholder="Search..."
            />
          </div>
        </div>
      )}
      <For each={filteredItems()}>
        {(item) => (
          <div
            id={item.key}
            onClick={item.handler}
            class="menu-item"
            data-testid={`menu-item-${item.key}`}
          >
            {item.label}
          </div>
        )}
      </For>
    </div>
  );
};
