import { useEffect, useMemo, useRef } from "react";

import { DEFAULT_MAX_DELAY_BETWEEN_STROKES_MS } from "./constants";
import { ModifierStates, RecordedStroke, SequenceDescriptor, UseKeysPress, UseKeysPressProps } from "./types";

const getModifiersUnion = (
  strokes: RecordedStroke[],
  sequenceMatchStart: number,
  sequenceLength: number
): ModifierStates =>
  strokes
    .slice(sequenceMatchStart)
    .reduce<ModifierStates>((acc, key, index) => {
      /** prevent checking more strokes than needed */
      if (index >= sequenceLength) {
        return acc;
      }

      if (!("alt" in acc)) {
        acc.alt = key.alt;
      } else {
        acc.alt = acc.alt && key.alt;
      }
      if (!("shift" in acc)) {
        acc.shift = key.shift;
      } else {
        acc.shift = acc.shift && key.shift;
      }
      if (!("meta" in acc)) {
        acc.meta = key.meta;
      } else {
        acc.meta = acc.meta && key.meta;
      }
      if (!("ctrl" in acc)) {
        acc.ctrl = key.ctrl;
      } else {
        acc.ctrl = acc.ctrl && key.ctrl;
      }

      return acc;
    }, {});

const getSequenceMatch = (
  strokesBuffer: RecordedStroke[],
  sequences: SequenceDescriptor[]
): SequenceDescriptor | null =>
  sequences.find((sequence) => {
    const keysUnion = strokesBuffer
      .map(({ key }) => key)
      .join("")
      .toLocaleLowerCase();

    const sequenceUnion = sequence.keys.join("").toLocaleLowerCase();

    if (keysUnion.includes(sequenceUnion)) {
      const matchStart = strokesBuffer.findIndex(
        ({ key }) =>
          key.toLocaleLowerCase() === sequence.keys[0].toLocaleLowerCase()
      );

      const modifiersUnion = getModifiersUnion(
        strokesBuffer,
        matchStart,
        sequence.keys.length
      );

      if (
        !!modifiersUnion.alt !== !!sequence.alt ||
        !!modifiersUnion.ctrl !== !!sequence.ctrl ||
        !!modifiersUnion.meta !== !!sequence.meta ||
        !!modifiersUnion.shift !== !!sequence.shift
      ) {
        return false;
      }
      return true;
    }

    return false;
  }) ?? null;

export const useKeysPress = ({
  getRoot,
  sequences = [],
  keyUp,
  captureMode,
  maxDelayBetweenStrokesMS = DEFAULT_MAX_DELAY_BETWEEN_STROKES_MS,
}: UseKeysPressProps): UseKeysPress => {
  const keysBuffer = useRef<RecordedStroke[]>([]);
  const lastSequenceStart = useRef<number>(Date.now());
  const maxSequenceLength = useMemo<number>(
    () => Math.max(...sequences.map(({ keys }) => keys.length)),
    [sequences]
  );

  const root = useMemo(() => getRoot?.() || window, [getRoot]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const currentTime = Date.now();

      /** maxDelayBetweenStrokesMS */
      if (currentTime - lastSequenceStart.current > maxDelayBetweenStrokesMS) {
        keysBuffer.current = [
          {
            key: event.key,
            alt: event.altKey,
            ctrl: event.ctrlKey,
            meta: event.metaKey,
          },
        ];
      } else {
        keysBuffer.current.push({
          key: event.key,
          alt: event.altKey,
          ctrl: event.ctrlKey,
          meta: event.metaKey,
        });
      }
      lastSequenceStart.current = currentTime;

      /** keep recorded strokes from growing too much */
      if (keysBuffer.current.length > maxSequenceLength) {
        keysBuffer.current = keysBuffer.current.slice(-1 * maxSequenceLength);
      }

      const match = getSequenceMatch(keysBuffer.current, sequences);

      if (match) {
        if (match.preventDefault) {
          event.preventDefault();
        }
        if (match.stopPropagation) {
          if (match.stopPropagation === "normal") event.stopPropagation();
          else event.stopImmediatePropagation();
        }
        match.handler(match, event);
      }
    };

    const eventName: "keyup" | "keydown" = keyUp ? "keyup" : "keydown";

    const currentRoot = "current" in root ? root.current : root;

    if (currentRoot) {
      (currentRoot.addEventListener as HTMLElement["addEventListener"])(
        eventName,
        handleKey,
        {
          capture: !!captureMode,
        }
      );
    }

    return () => {
      if (currentRoot) {
        (currentRoot.removeEventListener as HTMLElement["removeEventListener"])(
          eventName,
          handleKey,
          {
            capture: !!captureMode,
          }
        );
      }
    };
  }, [
    JSON.stringify(sequences),
    sequences.map(({ handler }) => handler),
    keyUp,
    root,
    maxDelayBetweenStrokesMS,
    captureMode,
    maxSequenceLength,
  ]);
};
