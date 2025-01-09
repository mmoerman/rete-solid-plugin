import { createSignal } from "solid-js";

interface SearchElementProps {
  onChange?: (event: InputEvent) => void;
  value?: string;
}

export const SearchElement = (props: SearchElementProps) => {
  const [text, setText] = createSignal(props.value || "");

  const handleInput = (event: InputEvent) => {
    const newText = (event.target as HTMLInputElement).value;
    setText(newText);

    if (props.onChange) {
      // Create a new custom InputEvent like in the Lit version
      const newEvent = new InputEvent("change");
      Object.defineProperty(newEvent, "target", {
        writable: false,
        value: event.target,
      });
      props.onChange(newEvent);
    }
  };

  return (
    <input
      class="search"
      value={text()}
      onInput={handleInput}
      data-testid="context-menu-search-input"
      style={{
        "color": "white",
        "padding": "1px 8px",
        "border": "1px solid white",
        "border-radius": "10px",
        "font-size": "16px",
        "font-family": "serif",
        "width": "100%",
        "box-sizing": "border-box",
        "background": "transparent",
      }}
    />
  );
};
