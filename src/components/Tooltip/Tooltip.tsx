import React, { CSSProperties, useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import PropTypes from "prop-types";
import styles from "./Tooltip.scss";
import { TransitionStatus } from "react-transition-group/Transition";

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  position: "top" | "bottom" | "right" | "left";
  rootElem: HTMLElement;
  show: boolean;
  offsetX?: number;
  offsetY?: number;
  style?: CSSProperties;
}

type PositionState = {
  left: string | number | undefined;
  top: string | number | undefined;
  right: string | number | undefined;
  bottom: string | number | undefined;
};

const noPosState = {
  left: undefined,
  top: undefined,
  right: undefined,
  bottom: undefined,
};

const Tooltip = ({
  label,
  position,
  rootElem,
  show,
  offsetX,
  offsetY,
  style,
  ...rest
}: TooltipProps) => {
  const [pos, setPos] = useState<PositionState>(noPosState);
  const [oldPos, setOldPos] = useState<PositionState>(noPosState);

  useEffect(() => {
    if (rootElem) {
      setOldPos(pos);
      setPos(calcPosition());
    } else {
      setOldPos(pos);
      setPos(noPosState);
    }
    return () => {
      setPos(noPosState);
    };
  }, [rootElem, show]);

  const calcPosition = () => {
    const parentBCR = (rootElem?.parentNode as
      | HTMLElement
      | undefined)?.getBoundingClientRect?.();

    if (!parentBCR) {
      return noPosState;
    }

    const bcr = rootElem.getBoundingClientRect();

    switch (position) {
      case "bottom":
        return {
          left: `calc(${
            bcr.x - parentBCR.x + bcr.width / 2 + (offsetX ?? 0)
          }px)`,
          top: `calc(${bcr.y - parentBCR.y + bcr.height + (offsetY ?? 0)}px)`,
          right: undefined,
          bottom: undefined,
        };
      case "left":
        return {
          left: `calc(${
            parentBCR.x - bcr.x - bcr.width / 2 + (offsetX ?? 0)
          }px - 100%)`,
          top: `calc(${
            bcr.y - parentBCR.y + bcr.height / 2 + (offsetY ?? 0)
          }px)`,
          right: undefined,
          bottom: undefined,
        };
      case "right":
        return {
          right: `calc(${
            parentBCR.x - bcr.x - bcr.width / 2 + (offsetX ?? 0)
          }px - 100%)`,
          top: `calc(${
            bcr.y - parentBCR.y + bcr.height / 2 + (offsetY ?? 0)
          }px)`,
          left: undefined,
          bottom: undefined,
        };
      case "top":
      default:
        return {
          left: `calc(${
            bcr.x - parentBCR.x + bcr.width / 2 + (offsetX ?? 0)
          }px `,
          top: `calc(${bcr.y - parentBCR.y + (offsetY ?? 0)}px - .625rem)`,
          right: undefined,
          bottom: undefined,
        };
    }
  };
  const duration = 325;
  const transitionStyles: { [K in TransitionStatus]: CSSProperties | {} } = {
    entering: { opacity: 1, ...pos },
    entered: { opacity: 1, ...pos },
    exiting: { opacity: 0, ...oldPos },
    exited: { opacity: 0, ...oldPos },
    unmounted: {},
  };
  return (
    <Transition mountOnEnter unmountOnExit timeout={duration} in={show} appear>
      {(state: TransitionStatus) => (
        <div
          {...rest}
          className={`${styles["tooltip-outer"]} ${
            styles[position] ? styles[position] : styles["top"]
          }`}
          style={{
            ...style,
            transition: `opacity ${duration}ms ease-in-out`,
            ...transitionStyles[state],
          }}
        >
          {label}
        </div>
      )}
    </Transition>
  );
};

Tooltip.propTypes = {
  label: PropTypes.string,
  position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  rootElem: PropTypes.instanceOf(HTMLElement),
  show: PropTypes.bool,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  style: PropTypes.object,
};

Tooltip.defaultProps = {
  offsetY: 0,
  offsetX: 0,
  position: "right",
};

export default Tooltip;
