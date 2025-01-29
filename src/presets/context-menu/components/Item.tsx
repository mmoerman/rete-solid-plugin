import {Component, createSignal, Show, createUniqueId, ParentProps, JSX} from "solid-js";
import { css, styled } from "solid-styled-components";
import { useDebounce } from "../hooks";
import { CommonStyle } from "../styles";
import { Customize, Item } from "../types";
import { $width } from "../vars";

// Styled Components using solid-styled-components
export const ItemStyle = styled(CommonStyle)<{ hasSubitems?: boolean }>`
  ${(props) =>
    props.hasSubitems ?
    css`
      &:after {
        content: "►";
        position: absolute;
        opacity: 0.6;
        right: 5px;
        top: 5px;
      }
    ` : ''}
`;

export const SubitemStyles = styled("div")`
  position: absolute;
  top: 0;
  left: 100%;
  width: ${String($width)}px;
`;

interface ItemStyleProps extends ParentProps {
    hasSubitems?: boolean;
    onPointerOver?: () => void;
    onPointerLeave?: () => void;
    onClick?: (e: MouseEvent) => void;
}

interface ItemProps extends ParentProps {
  data: Item;
  delay: number;
  hide(): void;
  components?: Pick<Customize, "item" | "subitems">;
}

export const ItemElement: Component<ItemProps> = (props) => {
  const [visibleSubitems, setVisibleSubitems] = createSignal(false);
  const setInvisible = () => setVisibleSubitems(false);
  const [hide, cancelHide] = useDebounce(setInvisible, props.delay);

  // Components can be customized via props
  const ItemComponent =
      props.components?.item?.(props.data) || ((props: ItemStyleProps) => <ItemStyle {...props} />);
  const Subitems =
      props.components?.subitems?.(props.data) || SubitemStyles;

  return (
      <ItemComponent
          onClick={(e: MouseEvent) => {
            e.stopPropagation();
            props.data.handler();
            props.hide();
          }}
          hasSubitems={Boolean(props.data.subitems)}
          onPointerOver={() => {
            cancelHide();
            setVisibleSubitems(true);
          }}
          onPointerLeave={() => {
            if (hide) hide();
          }}
      >
        {props.children}
        <Show when={props.data.subitems && visibleSubitems()}>
          <Subitems>
            {props.data.subitems?.map((item) => (
                <ItemElement
                    data={item}
                    delay={props.delay}
                    hide={props.hide}
                    components={props.components}
                >
                  {item.label}
                </ItemElement>
            ))}
          </Subitems>
        </Show>
      </ItemComponent>
  );
};
