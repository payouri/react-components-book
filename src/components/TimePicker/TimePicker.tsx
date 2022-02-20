import React, { Component } from "react";
import PropTypes from "prop-types";

import styles from "./TimePicker.scss";

const HOURS_IN_DAY = 24,
  MINUTES_IN_HOUR = 60;

const calcCirclePoint = function (
  cx: number,
  cy: number,
  r: number,
  ang: number
) {
  return {
    x: cx + r * Math.cos(ang),
    y: cy + r * Math.sin(ang),
  };
};

const ClockHand = function ({ angle }: { angle: number }) {
  return (
    <div
      style={{
        backgroundColor: "cornflowerblue",
        height: 90,
        left: "calc(50% - 4px)",
        position: "absolute",
        transform: `rotateZ(${angle}rad)`,
        transformOrigin: "bottom center",
        top: 44,
        width: 2,
        // transition: 'transform .125s'
      }}
    ></div>
  );
};

export interface PickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  type: "hours" | "minutes";
  n: number;
  onClick: (n: number) => void;
}

const Picker = function ({ n, onClick }: PickerProps) {
  return (
    <div className={styles["picker"]} onClick={() => onClick(n)}>
      {n < 10 ? "0" + n : n}
    </div>
  );
};
Picker.propTypes = {
  n: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export interface PickerWrapperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onMouseMove"> {
  type: "hours" | "minutes";
  n: number;
  onMouseMove?: (n: number) => void;
}

const PickerWrapper = function ({
  type,
  n,
  children,
  onMouseMove,
  ...rest
}: PickerWrapperProps) {
  const [active, setActive] = React.useState(false);

  const step = type == "hours" ? 1 : 5,
    max = type == "hours" ? HOURS_IN_DAY : MINUTES_IN_HOUR;

  const angle = ((2 * Math.PI) / max) * step;
  const startingAngle = Math.PI / 2;

  const cx = 256 / 2 - 16,
    cy = 256 / 2 - 8,
    r = 180 / 2;

  const { x, y } = calcCirclePoint(cx, cy, r, angle * n - startingAngle);

  return (
    <div
      {...rest}
      onMouseMove={() => {
        setActive(true);
        typeof onMouseMove == "function" && onMouseMove(angle * n);
      }}
      onMouseLeave={() => setActive(false)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        backgroundColor: active ? "cornflowerblue" : "",
        borderRadius: "50%",
        height: "1.5rem",
        width: "1.5rem",
        textAlign: "center",
        lineHeight: "1.5rem",
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
};
PickerWrapper.propTypes = {
  n: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["hours", "minutes"]),
  children: PropTypes.element,
};

type TimeUnit = "hours" | "minutes";

type TimeUnitObject = {
  [K in TimeUnit]: number | null;
};

export interface TimePickerProps {
  initialDate?: Date;
  initialTime?: Date;
  onDateClick?: (date: Date) => void;
  onPickTime?: (date: Date) => void;
  locale?: string;
}

export interface TimePickerState extends TimeUnitObject {
  count: number;
  clockAngle: number;
  mode: TimeUnit;
}

export class TimePicker extends Component<
  TimePickerProps & React.HTMLAttributes<HTMLDivElement>,
  TimePickerState
> {
  static Picker = Picker;
  static PickerWrapper = PickerWrapper;

  static propTypes = {
    initialTime: PropTypes.instanceOf(Date).isRequired,
    onPickTime: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialTime: new Date(),
    onPickTime: () => {},
  };

  private modes: { [K in TimeUnit]: TimeUnit };
  private anim: number | null;

  constructor(props: TimePickerProps) {
    super(props);

    this.modes = {
      hours: "minutes",
      minutes: "hours",
    };

    this.state = {
      hours: null,
      minutes: null,
      count: 0,
      mode: "hours",
      clockAngle: 0,
    };

    this.anim = null;

    this._pickTime = this._pickTime.bind(this);
  }

  toggleMode() {
    const { mode } = this.state;

    this.setState({
      mode: this.modes[mode],
    });
  }

  _updateClockHand(angle: number) {
    this.setState({
      clockAngle: angle,
    });
  }

  _pickTime(n: number) {
    const { onPickTime } = this.props;
    const { mode } = this.state;

    this.setState(
      {
        ...this.state,
        [mode]: n,
        mode: this.modes[mode],
      },
      () => {
        const { minutes, hours } = this.state;

        if (
          typeof minutes == "number" &&
          typeof hours == "number" &&
          mode == "minutes"
        ) {
          const d = new Date();
          d.setHours(hours, minutes, 0, 0);

          typeof onPickTime == "function" && onPickTime(d);

          this.setState({
            hours: null,
            minutes: null,
          });
        }
      }
    );
  }

  _count() {}

  _flow(force: boolean) {
    if (force) {
      this.anim = requestAnimationFrame(this._count);
    } else if (typeof this.anim === "number") {
      cancelAnimationFrame(this.anim);
    }
  }

  render() {
    const {
      onDateClick,
      initialDate,
      initialTime,
      onPickTime,
      ...rest
    } = this.props;

    const { mode, clockAngle } = this.state;
    const minuteStep = 5;

    return (
      <div className={styles["time-picker-wrapper"]} {...rest}>
        <ClockHand angle={clockAngle} />
        {Array.from(
          {
            length:
              mode == "hours" ? HOURS_IN_DAY : MINUTES_IN_HOUR / minuteStep,
          },
          (v, k) => {
            const n = mode == "hours" ? k : k * minuteStep;

            // console.log(k, v, n);
            return (
              <PickerWrapper
                key={k}
                n={k}
                type={mode}
                onMouseMove={(angle) => this._updateClockHand(angle)}
              >
                <Picker
                  type="hours"
                  className={`${styles["picker"]} ${styles["picker-active"]}`}
                  n={n}
                  onClick={() => {
                    this._pickTime(n);
                  }}
                />
              </PickerWrapper>
            );
          }
        )}
      </div>
    );
  }
}

export default TimePicker;
