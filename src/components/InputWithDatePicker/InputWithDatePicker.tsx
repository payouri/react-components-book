import React, { ChangeEvent, Component, RefObject } from "react";
import PropTypes from "prop-types";
import DatePicker from "../DatePicker/DatePicker";
import Input from "components/Input/Input";
import { monthsFormats, yearFormats, daysFormats } from "../../commons/js/date";

import styles from "./InputWithDropdown.scss";

export interface InputWithDatePickerProps {
  value: string;
  locale: string;
  format: Intl.DateTimeFormatOptions;
  validator: (date: string) => boolean | RegExp;
}

export interface InputWithDatePickerState {
  focus: boolean;
  value: string;
  selectedDate: Date | undefined;
}

export class InputWithDatePicker extends Component<
  InputWithDatePickerProps,
  InputWithDatePickerState
> {
  static propTypes = {
    value: PropTypes.string,
    format: PropTypes.shape({
      day: PropTypes.oneOf(daysFormats),
      month: PropTypes.oneOf(monthsFormats),
      year: PropTypes.oneOf(yearFormats),
    }),
    locale: PropTypes.string,
    validator: PropTypes.oneOfType([
      PropTypes.instanceOf(RegExp),
      PropTypes.func,
    ]),
  };

  static defaultProps = {
    format: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
    locale: "fr-FR",
    validator: /^\d{2}\/\d{2}\/\d{4}$/,
  };

  private inputRef: RefObject<HTMLInputElement>;
  private timeOut: NodeJS.Timeout | null;

  constructor(props: InputWithDatePickerProps) {
    super(props);

    const { value } = this.props;

    this.inputRef = React.createRef();

    this.state = {
      focus: false,
      value: value || "",
      selectedDate: undefined,
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleDatePick = this.handleDatePick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.timeOut = null;
  }
  /**
   *
   * @param {Date} date
   */
  handleDatePick(date: Date | null) {
    const { locale, format } = this.props;

    if (this.timeOut) clearTimeout(this.timeOut);
    if (!date) return;

    this.setState({
      focus: false,
      selectedDate: date,
      value: date.toLocaleDateString(locale, format),
    });
  }
  handleKeyDown({ key }: React.KeyboardEvent<HTMLDivElement>) {
    if (key == "Escape" && this.inputRef.current) this.inputRef.current.blur();
  }
  handleFocus() {
    const { focus } = this.state;

    if (this.timeOut) clearTimeout(this.timeOut);
    if (!focus) {
      this.setState({
        focus: true,
      });
    }
  }
  handleBlur() {
    const { focus } = this.state;

    this.timeOut = setTimeout(() => {
      if (focus)
        this.setState({
          focus: false,
        });
    }, 0);
  }
  _validateDate(date: Date | string) {
    const { validator } = this.props;

    if (date instanceof Date && !isNaN(date.getTime())) return true;
    else if (typeof date == "string") {
      if (validator instanceof RegExp) return validator.test(date);
      else if (typeof validator == "function") return validator(date);
    }
  }
  handleInput(
    value: string,
    valid?: boolean,
    e?: ChangeEvent<HTMLInputElement>
  ) {
    this.setState({
      value,
    });
  }
  render() {
    const { locale, validator } = this.props;
    const { focus, value, selectedDate } = this.state;

    return (
      <div
        className={styles["input-with-date-picker"]}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
      >
        <Input
          pattern={
            validator instanceof RegExp
              ? validator
                  .toString()
                  .substring(1, validator.toString().length - 1)
              : undefined
          }
          value={value}
          inputRef={this.inputRef}
          onChange={this.handleInput}
          placeholder="jj/mm/aaaa"
        />
        {focus && (
          <DatePicker
            style={{ position: "absolute", zIndex: 999 }}
            initialDate={selectedDate}
            tabIndex={0}
            locale={locale}
            onDateClick={this.handleDatePick}
            onCancel={() => {

            }}
          />
        )}
      </div>
    );
  }
}

export default InputWithDatePicker;
