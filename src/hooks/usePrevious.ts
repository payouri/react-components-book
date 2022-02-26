import isEqual from "lodash.isequal";
import { useEffect, useRef } from "react";

export const usePrevious = <T extends unknown>(
  value: T,
  onlyDifferent = false,
  diffFn: (current: T, previous: T | undefined) => boolean = (
    current,
    previous
  ) => isEqual(current, previous)
) => {
  const prev = useRef<T>();

  useEffect(() => {
    if (onlyDifferent && !diffFn(value, prev.current)) {
      return;
    }

    prev.current = value;
  }, [value]);

  return prev.current;
};
