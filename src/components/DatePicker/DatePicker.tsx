import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/Icon";
import {
  daysInMonth,
  getFirstDayOfTheMonth,
  weekdaysFormats,
  monthsFormats,
  yearFormats,
} from "../../commons/js/date";

import styles from "./DatePicker.scss";

const DAYS_IN_WEEK = 7;

interface TitleProps {
  /** from 0 to 11 */
  month: number;
  year: number;
  locale: string;
  format: Intl.DateTimeFormatOptions;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Title = function ({ month, year, locale, format, onClick }: TitleProps) {
  const d = new Date(year, month).toLocaleDateString(locale, format);

  return (
    <div className={styles["title"]} onClick={onClick}>
      {d[0].toUpperCase() + d.substr(1)}
    </div>
  );
};
Title.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  locale: PropTypes.string,
  format: PropTypes.exact({
    month: PropTypes.oneOf(monthsFormats),
    year: PropTypes.oneOf(yearFormats).isRequired,
  }),
  onClick: PropTypes.func,
};
Title.defaultProps = {
  locale: "fr-FR",
  format: {
    month: "long",
    year: "numeric",
  },
};

interface DayHeadingProps {
  date: Date;
  locale: string;
  format: Intl.DateTimeFormatOptions["weekday"];
}

const DayHeading = function ({ date, locale, format }: DayHeadingProps) {
  const wd = date.toLocaleDateString(locale, { weekday: format });
  return (
    <div className={styles["day-heading"]}>
      {wd[0].toUpperCase() +
        wd.substring(
          1,
          locale == "fr-FR" && format == "short" ? wd.length - 1 : undefined
        )}
    </div>
  );
};
DayHeading.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  format: PropTypes.oneOf(weekdaysFormats),
  locale: PropTypes.string,
};
DayHeading.defaultProps = {
  format: "long",
  locale: "fr-FR",
};

interface DayProps {
  day: number;
  today: boolean;
  onClick: (day: number) => void;
}

const Day = function ({ day, today, onClick }: DayProps) {
  return (
    <div
      tabIndex={0}
      className={
        today ? `${styles["day"]} ${styles["day-today"]}` : styles["day"]
      }
      data-day={day}
      onKeyDown={(keyEvent) => {
        const { key, target } = keyEvent;

        if (key == "Enter" || key == "Space") onClick(day);
        else if (key == "Escape" && target instanceof HTMLElement)
          target.blur();
      }}
      onClick={() => onClick(day)}
    >
      {day < 10 ? "0" + day : day}
    </div>
  );
};
Day.propTypes = {
  day: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  today: PropTypes.bool,
};

interface MonthProps {
  month: number;
  today: boolean;
  onClick: (month: number) => void;
  format: Intl.DateTimeFormatOptions["month"];
  locale: string;
}

const Month = function ({ month, today, onClick, format, locale }: MonthProps) {
  const d = new Date();
  d.setMonth(month);

  const m = d.toLocaleDateString(locale, { month: format });

  return (
    <div
      tabIndex={0}
      className={
        today ? `${styles["month"]} ${styles["month-today"]}` : styles["month"]
      }
      data-day={month}
      onKeyDown={(keyEvent) => {
        const { key, target } = keyEvent;

        if (key == "Enter" || key == "Space") onClick(month);
        else if (key == "Escape" && target instanceof HTMLElement)
          target.blur();
      }}
      onClick={() => onClick(month)}
    >
      {m[0].toUpperCase() +
        m.substring(
          1,
          locale == "fr-FR" && format == "short" ? m.length - 1 : undefined
        )}
    </div>
  );
};
Month.propTypes = {
  format: PropTypes.oneOf(monthsFormats),
  onClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  locale: PropTypes.string,
  month: PropTypes.number.isRequired,
  today: PropTypes.bool,
};

Month.defaultProps = {
  format: "long",
  locale: "fr-FR",
};

const EmptyPlaceholderDay = function () {
  return (
    <div className={styles["day-wrapper"]}>
      <div className={styles["other-month"]}></div>
    </div>
  );
};
EmptyPlaceholderDay.propTypes = {};

interface DatePickerProps {
  initialDate: Date;
  startingDay: number;
  locale: string;
  headingFormat: DayHeadingProps["format"];
  monthTitleFormat: Intl.DateTimeFormatOptions;
  onDateClick: (selected: DatePickerStates["selected"]) => void;
  onMonthClick: (selected: DatePickerStates["month"]) => void;
}

type DatePickerModes = "day" | "month";

interface DatePickerStates {
  selected: Date | null;
  month: number;
  year: number;
  mode: DatePickerModes;
}

export default class DatePicker extends Component<
  DatePickerProps,
  DatePickerStates
> {
  static Title = Title;
  static Day = Day;
  static DayHeading = DayHeading;
  static Month = Month;

  static propTypes = {
    initialDate: PropTypes.instanceOf(Date),
    startingDay: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    onDateClick: PropTypes.func,
    onMonthClick: PropTypes.func,
    locale: PropTypes.string,
    headingFormat: DayHeading.propTypes.format,
    monthTitleFormat: Title.propTypes.format,
  };

  static defaultProps = {
    initialDate: new Date(),
    startingDay: 1,
    locale: "fr-FR",
    headingFormat: "short",
    monthTitleFormat: Title.defaultProps.format,
  };

  private initialDate: Date;
  private today: Date;
  private modes: { [key in DatePickerModes]: DatePickerModes };

  constructor(props: DatePickerProps) {
    super(props);

    const { initialDate } = this.props;
    initialDate.setHours(0, 0, 0, 0);

    this.initialDate = initialDate;
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.modes = {
      day: "month",
      month: "day",
    };
    this.state = {
      selected: null,
      month: initialDate.getMonth(),
      year: initialDate.getFullYear(),
      mode: "day",
    };

    this.setMonth = this.setMonth.bind(this);
    this.handleDayPick = this.handleDayPick.bind(this);
    this.toggleGridMode = this.toggleGridMode.bind(this);
  }
  toggleGridMode() {
    const { mode } = this.state;

    this.setState({
      mode: this.modes[mode],
    });
  }
  _createDate(n: number) {
    const { month, year } = this.state;

    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setMonth(month);
    d.setFullYear(year);
    d.setDate(n);

    return d;
  }
  handleMonthPick(
    n: number,
    onMonthClick?: (month: DatePickerStates["month"]) => void
  ) {
    this.setState(
      {
        month: n,
        mode: "day",
      },
      () => {
        typeof onMonthClick == "function" && onMonthClick(n);
      }
    );
  }
  handleDayPick(
    n: number,
    onDateClick?: (day: DatePickerStates["selected"]) => void
  ) {
    this.setState(
      {
        selected: this._createDate(n),
      },
      () => {
        const { selected } = this.state;

        typeof onDateClick == "function" && onDateClick(selected);
      }
    );
  }
  setYear(n: number) {
    const { year } = this.state;

    this.setState({
      year: year + n,
    });
  }
  setMonth(n: number) {
    const { month, year } = this.state;

    if (n + month > 11) {
      const newMonth = (n + month) % 11,
        addedYears = Math.floor((n + month) / 11);

      this.setState({
        month: newMonth - 1,
        year: year + addedYears,
      });
    } else if (month + n < 0) {
      const newMonth = 11,
        addedYears = -1;

      this.setState({
        month: newMonth,
        year: year + addedYears,
      });
    } else {
      this.setState({
        month: month + n,
      });
    }
  }
  render() {
    const {
      initialDate,
      startingDay,
      locale,
      headingFormat,
      monthTitleFormat,
      onDateClick,
      onMonthClick,
      ...rest
    } = this.props;
    const { month, year, mode } = this.state;

    const renderMonths = () => {
      const m = 12;

      return Array.from({ length: m }, (v, k) => (
        <div key={k} className={styles["month-wrapper"]}>
          <Month
            month={k}
            today={
              this.today.getMonth() == k && this.today.getFullYear() == year
            }
            onClick={(day) => {
              this.handleMonthPick(day, onMonthClick);
            }}
            onKeyDown={(day) => {
              this.handleMonthPick(day, onMonthClick);
            }}
            locale={locale}
            format={monthTitleFormat.month}
          />
        </div>
      ));
    };
    const renderDays = () => {
      const c = daysInMonth(month, year);

      const placeholders = Array.from(
        {
          length:
            (DAYS_IN_WEEK +
              getFirstDayOfTheMonth(month, year).getDay() -
              startingDay) %
            DAYS_IN_WEEK,
        },
        (v, k) => {
          return <EmptyPlaceholderDay key={"p-" + k} />;
        }
      );

      const days = Array.from({ length: c }, (v, k) => (
        <div key={k} className={styles["day-wrapper"]}>
          <Day
            day={k + 1}
            today={
              this.today.getMonth() == month &&
              this.today.getDate() == k + 1 &&
              this.today.getFullYear() == year
            }
            onClick={(day) => {
              this.handleDayPick(day, onDateClick);
            }}
            onKeyDown={(day) => {
              this.handleDayPick(day, onDateClick);
            }}
          />
        </div>
      ));
      return [...placeholders, ...days];
    };
    const renderHeadings = function () {
      const c = DAYS_IN_WEEK,
        dayHeadings = new Array(c);

      const d = new Date(
        initialDate.getTime() -
          (initialDate.getDay() - startingDay) * 24 * 60 * 60 * 1000
      );
      for (let i = 0, n = DAYS_IN_WEEK; i < n; i++) {
        dayHeadings[i] = (
          <DayHeading
            key={i}
            date={new Date(d.getTime() + 24 * 60 * 60 * 1000 * i)}
            format={headingFormat}
            locale={locale}
          />
        );
      }

      return dayHeadings;
    };

    return (
      <div className={styles["calendar-wrapper"]} {...rest}>
        <div className={styles["header"]}>
          <div className={styles["toolbar"]}>
            <button
              onClick={() => {
                mode == "day" ? this.setMonth(-1) : this.setYear(-1);
              }}
            >
              <span className={styles["hidden"]}>Mois Moins</span>
              <Icon name={"chevron-left"} />
            </button>
            <Title
              year={year}
              month={month}
              locale={locale}
              format={{
                year: monthTitleFormat.year,
                month: mode == "day" ? monthTitleFormat.month : undefined,
              }}
              onClick={this.toggleGridMode}
            />
            <button
              onClick={() => {
                mode == "day" ? this.setMonth(1) : this.setYear(1);
              }}
            >
              <span className={styles["hidden"]}>Mois Plus</span>
              <Icon name={"chevron-right"} />
            </button>
          </div>
          {mode == "day" && (
            <div className={styles["headings-wrapper"]}>{renderHeadings()}</div>
          )}
        </div>
        {mode == "day" && (
          <div className={styles["day-grid"]}>{renderDays.call(this)}</div>
        )}
        {mode == "month" && (
          <div className={styles["month-grid"]}>{renderMonths.call(this)}</div>
        )}
      </div>
    );
  }
}
