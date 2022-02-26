import { RefObject } from "react";

export type AcceptedRootTypes = Window | RefObject<HTMLElement>;

export type UseKeysPress = void;

export type ModifierStates = {
  alt?: boolean;
  shift?: boolean;
  ctrl?: boolean;
  meta?: boolean;
};

export type RecordedStroke = ModifierStates & {
  key: string;
};

export type ModifierKeys = keyof ModifierStates;

export type SequenceDescriptor = ModifierStates & {
  preventDefault?: boolean;
  stopPropagation?: "immediate" | "normal";
  handler: (
    sequenceDefinition: SequenceDescriptor,
    event: KeyboardEvent
  ) => void;
  keys: string[];
};

export type UseKeysPressProps = {
  sequences: SequenceDescriptor[];
  /** trigger bindings on keyUp */
  keyUp?: boolean;
  /** capturing mode instead of bubbling */
  captureMode?: boolean;
  /** use this to bind events to an element defaults to globalThis/window */
  getRoot?: () => AcceptedRootTypes;
  maxDelayBetweenStrokesMS?: number;
};
