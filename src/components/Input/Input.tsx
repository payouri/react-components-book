import React, { Component, createRef, RefObject } from "react";
import PropTypes from "prop-types";

import styles from "./Input.scss";

export interface InputProps
  extends Omit<
    React.HTMLAttributes<HTMLInputElement>,
    "onChange" | "onSubmit"
  > {
  inputRef?: React.RefObject<HTMLInputElement>;
  required?: boolean;
  value: string;
  onSubmit?: (
    value: string,
    valid: boolean,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  onChange?: (
    value: string,
    valid: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  validator?: ((value: string) => boolean) | RegExp;
}

export interface InputState {
  value: string;
  valid: boolean;
}

export class Input extends Component<
  InputProps & typeof Input.defaultProps,
  InputState
> {
  static propTypes = {
    required: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    validator: PropTypes.oneOf([PropTypes.instanceOf(RegExp), PropTypes.func]),
  };

  static defaultProps = {
    value: "",
  };

  private innerInputRef: RefObject<HTMLInputElement>;

  constructor(props: InputProps & typeof Input.defaultProps) {
    super(props);

    const { value } = this.props;

    this.state = {
      valid: false,
      value: value,
    };

    this.innerInputRef = createRef();

    this.handleInput = this.handleInput.bind(this);
    this._validate = this._validate.bind(this);
  }

  _validate() {
    const { required, validator } = this.props;
    const { value } = this.state;

    if (required && value.trim().length == 0) return false;

    if (validator) {
      if (validator instanceof RegExp) return validator.test(value);
      else if (typeof validator == "function") return validator(value);
    }

    return true;
  }

  handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { target } = e;

    this.setState(
      {
        value: target.value,
        valid: this._validate(),
      },
      () => {
        const { onChange } = this.props;

        typeof onChange == "function" &&
          onChange(this.state.value, this.state.valid, e);
      }
    );
  }

  render() {
    const { inputRef, onSubmit, ...rest } = this.props;
    const { value } = this.state;

    return (
      <input
        {...rest}
        ref={inputRef || this.innerInputRef}
        className={`${styles["input"]}`}
        value={this.props.value || value}
        onChange={this.handleInput}
        onKeyDown={({ key, ...event }) => {
          if (key === "Escape") {
            const ref = inputRef || this.innerInputRef;
            ref?.current?.blur();
          } else if (key === "Enter" && onSubmit) {
            onSubmit(value, this._validate(), { ...event, key });
          }
        }}
      />
    );
  }
}

export default Input;
