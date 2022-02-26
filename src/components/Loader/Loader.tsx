import PropTypes from "prop-types";
import React, { CSSProperties } from "react";

import styles from "./Loader.scss";

export const LoaderPropsTypes = {
  background: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.oneOf(["sm", "md", "lg"]).isRequired,
};

export interface LoaderProps {
  background?: CSSProperties["background"];
  color?: string;
  style?: CSSProperties;
  size: "sm" | "md" | "lg";
}

export const LoaderDefaultProps: LoaderProps = {
  size: "md",
};

export const Loader = (props: LoaderProps) => {
  const thisProps = {
    ...LoaderDefaultProps,
    ...props,
  };

  return (
    <div className={styles["loader-outer"]} style={thisProps.style}>
      <div
        className={`${styles["loader"]} ${styles[`loader-${thisProps.size}`]}`}
        style={{
          background: thisProps.background,
          borderColor: thisProps.color,
        }}
      ></div>
    </div>
  );
};

Loader.propTypes = LoaderPropsTypes;

export default Loader;
