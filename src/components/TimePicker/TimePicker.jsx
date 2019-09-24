import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './TimePicker.scss';

const HOURS_IN_DAY = 24,
    MINUTES_IN_HOUR = 60;

const Picker = function({ n, onClick }) {
    return <div className={styles['picker']} onClick={() => onClick(n)}>{n < 10 ? '0'+n : n}</div>
}
Picker.propTypes = {
    n: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
}

const PickerWrapper = function({ type, n, children }) {

    const step = type == 'hours' ? 1 : 5,
        max = type == 'hours' ? HOURS_IN_DAY : MINUTES_IN_HOUR;

    const angle = 2 * Math.PI / max / step;
    const startingAngle = Math.PI / 2

    const cx = 256/2 - 16,
        cy = 256/2 - 8,
        r = 180/2;
    
    return (
        <div style={{
            position: 'absolute',
            left: cx + r * Math.cos(angle * n - startingAngle),
            top: cy + r * Math.sin(angle * n - startingAngle)
        }}>
            {children}
        </div>
    )

}
PickerWrapper.propTypes = {
    n: PropTypes.number.isRequired,
    type: PropTypes.oneOf([
        'hours',
        'minutes',
    ]),
    children: PropTypes.element,
}

class TimePicker extends Component {

    static Picker = Picker;
    static PickerWrapper = PickerWrapper;

    constructor(props) {
        super(props);

        this.modes = {
            hours: 'minutes',
            minutes: 'hours',
        }

        this.state = {
            hours: null,
            minutes: null,
            mode: 'hours',
        }

    }
    toggleMode() {

        const { mode } = this.state;

        this.setState({
            mode: this.modes[mode],
        })

    }
    render() {

        const { mode } = this.state;

        const renderPickers = function() {

            const minuteStep = 5;

            return Array.from({length: mode == 'hours' ? HOURS_IN_DAY : MINUTES_IN_HOUR / minuteStep}, (v, k) => {
                const n = mode == 'hours' ? k : k * minuteStep;
                return (
                    <PickerWrapper key={k} n={n} type={mode}>
                        <Picker n={n} onClick={v => console.log(v)}/>
                    </PickerWrapper>
                )

            })

        }

        return (
            <div className={styles['time-picker-wrapper']}>
                { renderPickers() }
            </div>
        )
    }
}

TimePicker.propTypes = {
    initialTime: PropTypes.instanceOf(Date),
}

TimePicker.defaultProps = {
    initialTime: new Date(),
}

export default TimePicker;