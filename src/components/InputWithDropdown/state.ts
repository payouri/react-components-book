import { Reducer, useEffect, useReducer, useRef } from "react";

import { InputWithDropdownActions, InputWithDropdownState } from "./types";

export const getInitialState = <
  O extends { label: string; value: string | number }
>(): InputWithDropdownState<O> => ({
  inputValue: "",
  value: undefined,
  hasFocus: false,
  suggestionIndex: -1,
  selectedIndex: undefined,
});

const reducer = <O extends { label: string; value: string | number }>(
  state: InputWithDropdownState<O>,
  action: InputWithDropdownActions<O>
): InputWithDropdownState<O> => {
  switch (action.type) {
    case "updateState":
      return {
        ...state,
        ...action.payload,
      };
    default:
      throw new TypeError(`${action.type} is not a valid action`);
  }
};

export const useInputWithDropdownState = <
  O extends { label: string; value: string | number }
>(): InputWithDropdownState<O> & {
  setState: (update: Partial<InputWithDropdownState<O>>) => void;
} => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  const setState = (update: Partial<InputWithDropdownState<O>>) => {
    dispatch({
      type: "updateState",
      payload: update,
    });
  };

  return {
    ...state,
    setState,
  } as InputWithDropdownState<O> & {
    setState: (update: Partial<InputWithDropdownState<O>>) => void;
  };
};
