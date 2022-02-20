import React, { ChangeEvent, Component } from "react";
import PropTypes from "prop-types";
import styles from "./InputWithDropdown.scss";

//todo add loader

interface CustomComponentProps {
  label?: DropdownOptionProps["label"];
  index?: DropdownOptionProps["index"];
}

export interface DropdownOptionProps<
  CustomComponentProps extends {
    label?: DropdownOptionProps["label"];
    index?: DropdownOptionProps["index"];
  } = {
    label?: string;
    index?: number;
  }
> {
  label: string;
  tabIndex?: number;
  index?: number;
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  CustomComponent?:
    | string
    | ((props: CustomComponentProps, context?: any) => any)
    | (new (props: CustomComponentProps, context?: any) => any);
}

const DropdownOption = ({
  CustomComponent,
  label,
  tabIndex,
  index,
  onClick,
  ...rest
}: DropdownOptionProps) => {
  if (!CustomComponent)
    return (
      <li
        className={styles["option"]}
        onClick={onClick}
        tabIndex={tabIndex || Number(0)}
        data-index={index}
      >
        {label}
      </li>
    );
  else
    return (
      <li tabIndex={tabIndex || Number(0)} onClick={onClick} data-index={index}>
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

export interface InputWithDropdownProps {
  customOptionComponent?:
    | string
    | ((props: CustomComponentProps, context?: any) => any)
    | (new (props: CustomComponentProps, context?: any) => any);
  sortBy?: "value" | "label";
  onChange: (state: InputWithDropdownState) => void;
  options: { label: string; value: string | number }[];
  onSubmit: (state: InputWithDropdownState) => void;
}

export interface InputWithDropdownState {
  value:
    | InputWithDropdownProps["options"][number]["label"]
    | InputWithDropdownProps["options"][number]["value"];
  hasFocus: boolean;
  suggestionIndex: number;
  selectedIndex: number;
}

export class InputWithDropdown extends Component<
  InputWithDropdownProps & typeof InputWithDropdown.defaultProps,
  InputWithDropdownState
> {
  static defaultProps = {
    autoCompleteOnBlur: false,
    sortBy: "value",
    options: [
      {
        value: 10,
        label: "Ten",
      },
      {
        value: 9,
        label: "Nine",
      },
      {
        value: 8,
        label: "Eight",
      },
      {
        value: 7,
        label: "Seven",
      },
      {
        value: 6,
        label: "Six",
      },
      {
        value: 5,
        label: "Five",
      },
      {
        value: 4,
        label: "Four",
      },
      {
        value: 3,
        label: "Three",
      },
      {
        value: 2,
        label: "Two",
      },
      {
        value: 2,
        label: "One",
      },
    ],
    locale: "fr",
  };

  static propTypes = {
    customOptionComponent: PropTypes.func,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
    sortBy: PropTypes.oneOf(["label", "value"]).isRequired,
    locale: PropTypes.string,
    autoCompleteOnBlur: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static DropdownOption = DropdownOption;
  private inputRef: React.RefObject<HTMLInputElement>;

  constructor(
    props: InputWithDropdownProps & typeof InputWithDropdown.defaultProps
  ) {
    super(props);
    this.state = {
      value: "",
      hasFocus: false,
      suggestionIndex: -1,
      selectedIndex: -1,
    };

    this.inputRef = React.createRef();

    const sortBy: {
      [K in "label" | "value"]: (
        a: InputWithDropdownProps["options"][number],
        b: InputWithDropdownProps["options"][number]
      ) => number;
    } = {
      label: (
        a: InputWithDropdownProps["options"][number],
        b: InputWithDropdownProps["options"][number]
      ) => {
        return a.label.localeCompare(b.label, this.props.locale, {
          sensitivity: "base",
        });
      },
      value: (
        a: InputWithDropdownProps["options"][number],
        b: InputWithDropdownProps["options"][number]
      ) => {
        if (typeof a.value === "string" && typeof b.value === "string") {
          return a.label.localeCompare(b.label, this.props.locale, {
            sensitivity: "base",
          });
        } else if (typeof a.value === "number" && typeof b.value === "number")
          return a.value - b.value;
        else return 0;
      },
    };

    this.props.options.sort(
      sortBy[
        this.props.sortBy ?? (InputWithDropdown.defaultProps.sortBy as "value")
      ]
    );
  }
  handleSubmit = ({ key }: React.KeyboardEvent) => {
    const { suggestionIndex } = this.state;
    const { options } = this.props;

    if (key == "Escape" && this.inputRef.current) {
      this.inputRef.current.blur();
    }

    if (key == "Enter") {
      const { onSubmit } = this.props;

      if (this.inputRef.current) {
        this.inputRef.current.blur();
      }

      if (suggestionIndex > -1) {
        this.setState({
          selectedIndex: suggestionIndex,
          value:
            options[suggestionIndex].label || options[suggestionIndex].value,
        });
      }

      onSubmit && onSubmit(this.state);
    }
  };
  handleInput = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      { selectedIndex: -1, value: changeEvent.target.value },
      () => {
        const { options, onChange } = this.props,
          { value } = this.state;
        if (String(value).length > 0) {
          const optsByLabel = options.map((o) =>
            String(o.label || o.value)
              .substr(0, String(value).length)
              .toLowerCase()
          );

          this.setState(
            {
              suggestionIndex: optsByLabel.indexOf(String(value).toLowerCase()),
            },
            () => {
              onChange && onChange(this.state);
            }
          );
        } else
          this.setState({ suggestionIndex: -1 }, () => {
            onChange && onChange(this.state);
          });
      }
    );
  };
  handleFocusBlur = (FocusEvent: React.FocusEvent<HTMLDivElement>) => {
    const { type, relatedTarget } = FocusEvent,
      { options, autoCompleteOnBlur } = this.props;

    const newState: Partial<InputWithDropdownState> = {
      hasFocus: type == "focus",
    };

    // if(autoCompleteOnBlur) {

    let index = -1;

    if (
      relatedTarget &&
      (relatedTarget as HTMLElement).dataset &&
      (relatedTarget as HTMLElement).dataset.index
    ) {
      index = Number((relatedTarget as HTMLElement).dataset.index);
    }

    newState.selectedIndex = index;

    this.setState({ ...this.state, ...newState }, () => {
      if (this.state.selectedIndex > -1) {
        this.setState({
          value:
            options[this.state.selectedIndex].label ||
            options[this.state.selectedIndex].value,
          suggestionIndex: this.state.selectedIndex,
        });
      }
    });
  };
  handleOptionClick = ({ optIndex }: { optIndex: number }) => {};
  matchText = (s1: string, s2: string) => {
    s2 = s2.trim();
    s1 = s1.trim();

    s1 = s1.substr(0, s2.length).toLowerCase();

    return s1 === s2.toLowerCase();
  };
  render() {
    const { customOptionComponent, options } = this.props;
    const { hasFocus, value, suggestionIndex, selectedIndex } = this.state;

    return (
      <div className={styles["input-with-dropdown"]}>
        {hasFocus && (
          <div className={styles["dropdown-wrapper"]}>
            <div className={styles["suggestion"]}>
              {suggestionIndex > -1
                ? this.state.value +
                  String(
                    options[suggestionIndex].label ||
                      options[suggestionIndex].value
                  ).substr(String(this.state.value).length)
                : ""}
            </div>
            <ul className={styles["dropdown-inner"]}>
              {options.reduce((acc, option, index, optionsArr) => {
                let { value, label, ...otherProps } = option;

                let toMatch = String(label || value);

                if (
                  this.matchText(toMatch, String(this.state.value)) &&
                  index != suggestionIndex
                ) {
                  toMatch =
                    this.state.value +
                    toMatch.substr(String(this.state.value).length);

                  acc.push(
                    <DropdownOption
                      key={index}
                      label={toMatch}
                      value={value}
                      index={index}
                      {...otherProps}
                      CustomComponent={customOptionComponent}
                      onClick={(e) =>
                        this.handleOptionClick({ ...e, optIndex: index })
                      }
                    />
                  );
                }
                if (
                  index == optionsArr.length - 1 &&
                  acc.length == 0 &&
                  suggestionIndex == -1
                )
                  acc.push(
                    <DropdownOption
                      key={-1}
                      label={"Aucun résultat"}
                      value={""}
                      index={-1}
                      CustomComponent={customOptionComponent}
                      onClick={(e) =>
                        this.handleOptionClick({ ...e, optIndex: -1 })
                      }
                    />
                  );

                return acc;
              }, [] as JSX.Element[])}
            </ul>
          </div>
        )}
        <input
          onBlur={this.handleFocusBlur}
          onChange={this.handleInput}
          onFocus={this.handleFocusBlur}
          onKeyDown={this.handleSubmit}
          ref={this.inputRef}
          value={
            selectedIndex > -1
              ? options[selectedIndex].label || options[selectedIndex].value
              : value
          }
          style={{
            boxShadow: !value ? styles["input-shadow"]["boxShadow"] : null,
          }}
          type="text"
        ></input>
      </div>
    );
  }
}

export default InputWithDropdown;
