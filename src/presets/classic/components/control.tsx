import { createMemo } from "solid-js";
import type { ClassicPreset } from "rete";

interface ControlElementProps<N extends "text" | "number"> {
  data: ClassicPreset.InputControl<N> | null;
}

export const ControlElement = <N extends 'text' | 'number'>({data}: ControlElementProps<N>) => {
  console.log("Rendering ControlElement");

  // Handle the input event
  const handleInput = (e: InputEvent) => {
    if (!data) return;

    const target = e.target as HTMLInputElement;
    const val = data.type === "number" ? +target.value : target.value;

    data.setValue(val as typeof data["value"]);
  };

  // Memoized data to track changes reactively
  const inputValue = createMemo(() => (data ? data.value : ""));
  const inputType = createMemo(() => (data ? data.type : "text"));
  const isReadonly = createMemo(() => (data ? data.readonly : false));

  return (
    <input
      type={inputType()}
      value={inputValue()}
      readonly={isReadonly()}
      onInput={handleInput}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        "width": "100%",
        "border-radius": "30px",
        "background-color": "white",
        "padding": "2px 6px",
        "border": "1px solid #999",
        "font-size": "110%",
        "box-sizing": "border-box",
      }}
    />
  );
};
