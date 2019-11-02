import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './TimePicker.scss';

const HOURS_IN_DAY = 24,
    MINUTES_IN_HOUR = 60;

const calcCirclePoint = function(cx, cy, r, ang) {

    return {
        x: cx + r * Math.cos(ang),
        y: cy + r * Math.sin(ang)
    }

}

const ClockHand = function({ angle, hour, type }) {

    return (
        <div style={{
            backgroundColor: 'cornflowerblue',
            height: 90,
            left: 'calc(50% - 4px)',
            position: 'absolute',
            transform: `rotateZ(${angle}rad)`,
            transformOrigin: 'bottom center',
            top: 44,
            width: 2,
            // transition: 'transform .125s'
        }}></div>
    )

}

const Picker = function({ n, label, onClick }) {
    return <div className={styles['picker']} onClick={() => onClick(n)}>{n < 10 ? '0'+n : n}</div>
}
Picker.propTypes = {
    n: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
}

const PickerWrapper = function({ type, n, children, onMouseMove, ...rest }) {

    const [ active, setActive ] = React.useState(false);

    const step = type == 'hours' ? 1 : 5,
        max = type == 'hours' ? HOURS_IN_DAY : MINUTES_IN_HOUR;

    const angle = 2 * Math.PI / max * step;
    const startingAngle = Math.PI / 2;

    const cx = 256/2 - 16,
        cy = 256/2 - 8,
        r = 180/2;
    
    const { x, y } = calcCirclePoint(cx, cy, r, angle * n - startingAngle);

    return (
        <div {...rest} onMouseMove={() => { setActive(true); typeof onMouseMove == 'function' && onMouseMove(angle * n) }} onMouseLeave={() => setActive(false)} style={{
            position: 'absolute',
            left: x,
            top: y,
            backgroundColor: active ? 'cornflowerblue' : '',
            borderRadius: '50%',
            height: '1.5rem',
            width: '1.5rem',
            textAlign: 'center',
            lineHeight: '1.5rem',
            cursor: 'pointer',
        }}>
            {children}
        </div>
    );

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
            count: 0,
            mode: 'hours',
            clockAngle: 0,
        }

        this.anim = null;

        this._pickTime = this._pickTime.bind(this)

    }

    toggleMode() {

        const { mode } = this.state;

        this.setState({
            mode: this.modes[mode],
        })

    }

    _updateClockHand(angle) {

        this.setState({
            clockAngle: angle,
        });

    }

    _pickTime(n) {

        const { onPickTime } = this.props;
        const { mode } = this.state;

        this.setState({
            [mode]: n,
            mode: this.modes[mode],
        }, () => {
            
            const { minutes, hours } = this.state;
            
            if(typeof minutes == 'number' && typeof hours == 'number' && mode == 'minutes') {
                
                const d = new Date();
                d.setHours(hours, minutes, 0, 0);

                typeof onPickTime == 'function' && onPickTime(d)

                this.setState({
                    hours: null,
                    minutes: null,
                })
            }
        })

    }

    _flow(force) {

        if(force) {
            this.anim = requestAnimationFrame(this._count);
        } else {
            cancelAnimationFrame(this.anim);
        }

    }
    render() {

        const { onDateClick, initialDate, initialTime, onPickTime, ...rest } = this.props

        const { mode, clockAngle } = this.state;
        const minuteStep = 5;
        
        return (
            <div className={styles['time-picker-wrapper']} {...rest }>
                <ClockHand angle={ clockAngle }/>
                {
                    Array.from({length: mode == 'hours' ? HOURS_IN_DAY : MINUTES_IN_HOUR / minuteStep}, (v, k) => {

                        const n = mode == 'hours' ? k : k * minuteStep;
                        
                        // console.log(k, v, n);
                        return (
                            <PickerWrapper key={k} n={k} type={mode} onMouseMove={(angle) => this._updateClockHand(angle)}>
                                <Picker type='hours' className={`${styles['picker']} ${styles['picker-active']}`} n={n} onClick={() => { this._pickTime(n) }}/>
                            </PickerWrapper>
                        )
        
                    })
                }
            </div>
        )
    }
}

TimePicker.propTypes = {
    initialTime: PropTypes.instanceOf(Date).isRequired,
    onPickTime: PropTypes.func.isRequired,
}

TimePicker.defaultProps = {
    initialTime: new Date(),
    onPickTime: () => {},
}

export default TimePicker;