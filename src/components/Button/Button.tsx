import React, { FC, CSSProperties } from "react";
import PropTypes from "prop-types";
import Icon, { IconProps } from "../Icon/Icon";
import styles from "./Button.scss";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode | React.ReactNode[];
  icon?: IconProps["name"];
  iconStyle?: CSSProperties;
  size: "md" | "sm" | "lg";
  color: "purple" | "blue" | "yellow" | "green" | "red";
}

export const Button: FC<ButtonProps> = ({
  icon,
  children,
  iconStyle,
  size,
  color,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`${styles["button"]} ${styles[size]} ${
        color ? styles["btn-" + color] : ""
      }`}
    >
      {icon && (
        <Icon name={icon} style={{ marginRight: ".5rem", ...iconStyle }} />
      )}
      {children}
    </button>
  );
};

export default Button;

Button.propTypes = {
  icon: Icon.propTypes.name,
  children: PropTypes.element,
  iconStyle: PropTypes.object,
};
