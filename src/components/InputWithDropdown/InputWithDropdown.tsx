import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { getMatchingIndex } from "../../commons/js/functions";
import { useKeysPress } from "../../hooks/useKeys";
import { usePrevious } from "../../hooks/usePrevious";
import { DropdownOption } from "./components/DropdownOption";
import { InputWidthDropdownDefaultProps } from "./defaults";
import styles from "./InputWithDropdown.scss";
import { InputWidthDropdownPropsTypes } from "./propTypes";
import { useInputWithDropdownState } from "./state";
import { InputWithDropdownProps } from "./types";

//todo add loader
export interface InputWithDropdownState<
  O extends { label: string; value: string | number }
> {
  value: InputWithDropdownProps<O>["options"][number];
  hasFocus: boolean;
  suggestionIndex: number;
  selectedIndex: number;
}

const getSorts = (
  locale: string
): {
  [K in "label" | "value"]: (
    a: InputWithDropdownProps["options"][number],
    b: InputWithDropdownProps["options"][number]
  ) => number;
} => ({
  label: (
    a: InputWithDropdownProps["options"][number],
    b: InputWithDropdownProps["options"][number]
  ) => {
    return a.label.localeCompare(b.label, locale, {
      sensitivity: "base",
    });
  },
  value: (
    a: InputWithDropdownProps["options"][number],
    b: InputWithDropdownProps["options"][number]
  ) => {
    if (typeof a.value === "string" && typeof b.value === "string") {
      return a.label.localeCompare(b.label, locale, {
        sensitivity: "base",
      });
    } else if (typeof a.value === "number" && typeof b.value === "number")
      return a.value - b.value;
    else return 0;
  },
});

const matchText = (s1: string, s2: string) => {
  const trimmedS2 = s2.trim().toLowerCase();
  const trimmedS1 = s1.trim().substring(0, s2.length).toLowerCase();

  return trimmedS1 === trimmedS2;
};

export const InputWithDropdown = <
  O extends { label: string; value: string | number }
>(
  newProps: InputWithDropdownProps<O>
) => {
  const { setState, ...state } = useInputWithDropdownState<O>();
  const props = {
    ...InputWidthDropdownDefaultProps,
    ...newProps,
  };

  const { customOptionComponent, options, onChange, onSubmit, selectedOption } =
    props;
  const { hasFocus, value, inputValue, suggestionIndex, selectedIndex } = state;
  const previousHasFocus = usePrevious(hasFocus);

  const sortByFns = useMemo(
    () => getSorts(props.languageLocal),
    [props.languageLocal]
  );

  const sortedOptions = useMemo(
    () => [...options].sort(sortByFns[props.sortBy]),
    [JSON.stringify(props.options)]
  );

  const filteredOptions = useMemo(
    () =>
      [...sortedOptions].filter(
        (o) => matchText(o.label, inputValue) && o.value !== value?.value
      ),
    [JSON.stringify(sortedOptions), suggestionIndex, inputValue, value?.value]
  );

  const outerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onArrowUp = useCallback(() => {
    setState({
      selectedIndex:
        typeof selectedIndex !== "number"
          ? 0
          : getMatchingIndex(filteredOptions, selectedIndex - 1),
    });
  }, [selectedIndex, JSON.stringify(filteredOptions)]);

  const onArrowDown = useCallback(() => {
    setState({
      selectedIndex:
        typeof selectedIndex !== "number"
          ? 0
          : getMatchingIndex(filteredOptions, selectedIndex + 1),
    });
  }, [selectedIndex, JSON.stringify(filteredOptions)]);

  useKeysPress({
    getRoot: () => outerRef,
    sequences: [
      {
        preventDefault: true,
        handler: onArrowUp,
        keys: ["ArrowUp"],
      },
      {
        preventDefault: true,
        handler: onArrowDown,
        keys: ["ArrowDown"],
      },
    ],
  });

  const handleSubmit = ({ key }: React.KeyboardEvent) => {
    const { suggestionIndex } = state;

    if (key == "Escape" && inputRef.current) {
      inputRef.current.blur();
    }

    if (key == "Enter") {
      if (inputRef.current) {
        inputRef.current.blur();
      }

      if (suggestionIndex > -1) {
        const newValue = sortedOptions[suggestionIndex];
        setState({
          value: newValue,
          selectedIndex: suggestionIndex,
          inputValue: newValue.label,
        });
        onSubmit?.(newValue);
      } else {
        onSubmit?.(undefined);
      }
    }
  };

  const handleInput = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    setState({ inputValue: changeEvent.target.value });
  };

  useEffect(() => {
    if (!inputValue) {
      return setState({
        selectedIndex: undefined,
        suggestionIndex: -1,
        value: undefined,
      });
    }

    const selectedOption = sortedOptions.find(
      ({ label }) => label === inputValue
    );
    if (selectedOption?.value !== value) {
      return setState({
        value: selectedOption,
      });
    }

    const autoCompleteIndex = sortedOptions.findIndex(({ label }) =>
      matchText(label, inputValue)
    );
    return setState({
      value: undefined,
      suggestionIndex: autoCompleteIndex,
    });
  }, [inputValue, value]);

  useEffect(() => {
    if (selectedOption?.value !== value?.value) {
      onChange(value);
    }
  }, [value]);

  const handleFocusBlur = (FocusEvent: React.FocusEvent<HTMLInputElement>) => {
    const { type, relatedTarget } = FocusEvent;

    const newHasFocus =
      type === "focus" ||
      !!(
        relatedTarget &&
        outerRef.current &&
        outerRef.current.contains(relatedTarget)
      );

    const newState: Partial<InputWithDropdownState<O>> = {
      hasFocus: newHasFocus,
      selectedIndex:
        !newHasFocus && previousHasFocus ? undefined : selectedIndex,
    };

    setState(newState);
  };

  useEffect(() => {
    if (
      inputRef.current &&
      hasFocus &&
      inputValue.length &&
      hasFocus !== previousHasFocus
    ) {
      inputRef.current.setSelectionRange(inputValue.length, inputValue.length);
    }
  }, [hasFocus, inputValue.length]);

  const handleOptionClick = (
    newValueIndex: number,
    newValue?: InputWithDropdownProps<O>["options"][number]
  ) => {
    if (newValueIndex < 0 || (!newValue && value?.value !== newValue)) {
      setState({
        selectedIndex: undefined,
        value: newValue,
      });
    } else if (
      newValueIndex >= 0 &&
      newValue &&
      newValue.value !== value?.value
    ) {
      setState({
        selectedIndex: undefined,
        value: newValue,
        inputValue:
          sortedOptions.find((option) => option.value === newValue.value)
            ?.label ?? "",
      });
      inputRef?.current?.blur();
    }
  };

  return (
    <div ref={outerRef} className={styles["input-with-dropdown"]}>
      {hasFocus && (
        <div className={styles["dropdown-wrapper"]}>
          <div className={styles["suggestion"]}>
            {(selectedIndex || -1) > -1 && filteredOptions.length
              ? `${inputValue}${filteredOptions[selectedIndex!].label.substring(
                  inputValue.length
                )}`
              : suggestionIndex > -1
              ? `${inputValue}${sortedOptions[suggestionIndex].label.substring(
                  inputValue.length
                )}`
              : ""}
          </div>
          <ul className={styles["dropdown-inner"]}>
            {filteredOptions.reduce((acc, option, index, optionsArr) => {
              const { value: optionValue, label, ...otherProps } = option;

              acc.push(
                <DropdownOption
                  onClose={() => {
                    setState({
                      hasFocus: false,
                    });
                    inputRef.current?.blur();
                  }}
                  onSearch={(search) => {
                    setState({
                      inputValue: `${inputValue}${search}`,
                      selectedIndex: undefined,
                    });
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 0);
                  }}
                  onBackspace={() => {
                    setState({
                      inputValue: inputValue.slice(0, inputValue.length - 1),
                    });
                  }}
                  isSelected={index === selectedIndex}
                  key={optionValue}
                  label={inputValue + label.substring(inputValue.length)}
                  value={optionValue}
                  index={index}
                  {...otherProps}
                  CustomComponent={customOptionComponent}
                  onSelect={() => handleOptionClick(index, option)}
                />
              );

              if (
                index == optionsArr.length - 1 &&
                acc.length === 0 &&
                suggestionIndex === -1 &&
                !value?.value
              )
                acc.push(
                  <DropdownOption
                    onClose={() => {
                      setState({
                        hasFocus: false,
                      });
                      inputRef.current?.blur();
                    }}
                    onSearch={(search) => {
                      setState({
                        inputValue: search,
                        selectedIndex: undefined,
                      });
                      setTimeout(() => {
                        inputRef.current?.focus();
                      }, 0);
                    }}
                    onBackspace={() => {
                      setState({
                        inputValue: inputValue.slice(0, inputValue.length - 1),
                      });
                    }}
                    key={-1}
                    label={"Aucun résultat"}
                    value={""}
                    index={-1}
                    CustomComponent={customOptionComponent}
                    onSelect={() => {}}
                  />
                );

              return acc;
            }, [] as JSX.Element[])}
          </ul>
        </div>
      )}
      <input
        onBlur={handleFocusBlur}
        onChange={handleInput}
        onFocus={handleFocusBlur}
        onKeyDown={handleSubmit}
        ref={inputRef}
        value={inputValue}
        style={{
          boxShadow: !value ? styles["input-shadow"]["boxShadow"] : null,
        }}
        type="text"
      ></input>
    </div>
  );
};

InputWithDropdown.propTypes = InputWidthDropdownPropsTypes;
InputWithDropdown.DropdownOption = DropdownOption;

export default InputWithDropdown;
