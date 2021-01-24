import React, { useEffect, useState, useRef, memo } from "react";
import PropTypes from "prop-types";

import styles from "./TextTyper.scss";

export interface TextTyperProps {
  str: string;
  startIndex: number;
  pausingIndexes: number[];
  pauseTime: number;
  timeBetweenType: (charIndex: number) => number | number;
  typeUntil: number;
  onDone: () => void;
}

const TextTyper = ({
  str,
  startIndex,
  pausingIndexes,
  pauseTime,
  timeBetweenType,
  typeUntil,
  onDone,
  ...rest
}: TextTyperProps & TextTyper.defaultProps) => {
  const [index, setIndex] = useState<number>(startIndex);
  const [animate, setAnimate] = useState<boolean>(false);
  const ref = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const wait = pausingIndexes.includes(index)
      ? pauseTime
      : typeof timeBetweenType == "function"
      ? timeBetweenType(index)
      : timeBetweenType;
    ref.current = setTimeout(() => {
      if (
        index < str.length &&
        (typeof typeUntil != "number" || index < typeUntil)
      )
        type();
      else {
        if (ref.current) clearTimeout(ref.current);
        if (typeof typeUntil == "number") setIndex(str.length);
        if (index === str.length || index === typeUntil) {
          setAnimate(true);
          typeof onDone === "function" && onDone();
        }
      }
    }, wait);
    return () => {
      if (ref.current) clearTimeout(ref.current);
    };
  }, [str, index]);

  const type = () => {
    let newIndex = index + 1;
    if (str[newIndex] === "<") {
      newIndex = str.indexOf(">", newIndex);
    }
    setIndex(newIndex);
  };
  return (
    <div {...rest} className={styles["about-me"]}>
      <span
        className={`${styles["my-text"]} ${
          (animate && styles["my-text-animated"]) || ""
        }`}
        dangerouslySetInnerHTML={{ __html: str.substring(0, index) }}
      />
      <span
        style={{ position: "relative", top: "-.1em" }}
        className={
          pausingIndexes.includes(index) ||
          index == str.length ||
          index == typeUntil
            ? styles["blinking-cursor"]
            : ""
        }
      >
        |
      </span>
    </div>
  );
};

TextTyper.propTypes = {
  str: PropTypes.string.isRequired,
  pausingIndexes: PropTypes.arrayOf(PropTypes.number),
  pauseTime: PropTypes.number,
  timeBetweenType: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  typeUntil: PropTypes.number,
  startIndex: PropTypes.number,
  onDone: PropTypes.func,
};

TextTyper.defaultProps = {
  startIndex: 0,
  pausingIndexes: [],
  timeBetweenType: 75,
};

export default memo(TextTyper);
