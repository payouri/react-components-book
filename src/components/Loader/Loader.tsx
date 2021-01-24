import React, { Component, CSSProperties } from "react";
import PropTypes from "prop-types";

import styles from "./Loader.scss";

export interface LoaderProps {
  background?: CSSProperties["background"];
  color?: string;
  style?: CSSProperties;
  size: "sm" | "md" | "lg";
}

export class Loader extends Component<LoaderProps> {
  static propTypes = {
    background: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object,
    size: PropTypes.oneOf(["sm", "md", "lg"]).isRequired,
  };

  static defaultProps = {
    size: "md",
  };

  render() {
    return (
      <div className={styles["loader-outer"]} style={this.props.style}>
        <div
          className={`${styles["loader"]} ${
            styles[`loader-${this.props.size}`]
          }`}
          style={{
            background: this.props.background,
            borderColor: this.props.color,
          }}
        ></div>
      </div>
    );
  }
}

export default Loader;
