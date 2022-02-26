import PropTypes from "prop-types";
import { useEffect, useLayoutEffect, useRef } from "react";

import { DropdownOptionProps } from "../types";
import styles from "./DropdownOption.scss";

export const DropdownOption = ({
  CustomComponent,
  label,
  tabIndex,
  index,
  onSelect,
  onClose,
  onSearch,
  onBackspace,
  isSelected,
  ...rest
}: DropdownOptionProps) => {
  const wrapperRef = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    if (isSelected && wrapperRef.current) {
      wrapperRef.current.focus();
      wrapperRef.current.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
    }
  }, [isSelected]);

  if (!CustomComponent)
    return (
      <li
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSelect();
          } else if (event.key === "Backspace") {
            onBackspace();
          } else if (event.key === "Escape") {
            onClose();
          } else if (event.key.length === 1 || event.key === "Space") {
            event.stopPropagation();
            onSearch(event.key);
          }
        }}
        ref={wrapperRef}
        className={styles["option"]}
        onClick={() => {
          onSelect();
        }}
        tabIndex={tabIndex || Number(0)}
      >
        {label}
      </li>
    );
  else
    return (
      <li
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSelect();
          } else if (event.key === "Backspace") {
            onBackspace();
          } else if (event.key === "Escape") {
            onClose();
          } else if (event.key.length === 1 || event.key === "Space") {
            event.stopPropagation();
            onSearch(event.key);
          }
        }}
        ref={wrapperRef}
        tabIndex={tabIndex || Number(0)}
        onClick={() => {
          onSelect();
        }}
      >
        <CustomComponent label={label} index={index} {...rest} />
      </li>
    );
};

DropdownOption.propTypes = {
  CustomComponent: PropTypes.element,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  index: PropTypes.number.isRequired,
  label: PropTypes.string,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
};
