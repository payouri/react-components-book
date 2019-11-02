import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TimePicker from 'components/TimePicker/TimePicker'
import Input from 'components/Input/Input'
import { minutesFormats, hoursFormats } from 'js/date'

import styles from './InputWithTimePicker.scss'

class InputWithTimePicker extends Component {
    constructor(props) {
        
        super(props)

        const { value } = this.props;

        this.inputRef = React.createRef();

        this.state = {
            focus: false,
            value: value || '',
            selectedTime: undefined,
        }

        this.handleInput = this.handleInput.bind(this);
        this.handleTimePick = this.handleTimePick.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.timeOut = null;
    }
    handleTimePick(date) {

        const { locale, format } = this.props;

        clearTimeout(this.timeOut);
        this.setState({
            focus: false,
            selectedTime: date,
            value: date.toLocaleTimeString(locale, format),
        })

    }
    handleKeyDown({ key }) {
        console.log(key);
        if(key == 'Escape')
            this.inputRef.current.blur();

    }
    handleFocus() {
        
        const { focus } = this.state;

        clearTimeout(this.timeOut);
        if(!focus) {
            this.setState({
                focus: true,
            })
        }

    }
    handleBlur() {

        const { focus } = this.state;

        this.timeOut = setTimeout(() => {
            if(focus)
                this.setState({
                    focus: false,
                })
        }, 0)

    }
    _validateTime(time) {

        const { validator } = this.props;

        if(time instanceof Date && !isNaN(time))
            return true;
        else if(typeof time == 'string') {

            if(validator instanceof RegExp)
                return validator.test(time);
            else if(typeof validator == 'function') 
                return validator(time);
            return time
        }

    }
    handleInput(value, valid, event) {

        this.setState({
            value,
        })

    }
    render() {
        
        const { locale, validator } = this.props
        const { focus, value, selectedTime } = this.state;

        return (
            <div className={styles['input-with-time-picker']}    
                onFocus={this.handleFocus} 
                onBlur={this.handleBlur} 
                onKeyDown={ this.handleKeyDown }>
                <Input 
                    pattern={validator instanceof RegExp ? validator.toString().substring(1, validator.toString().length - 1) : undefined}
                    value={value}
                    inputRef={this.inputRef}
                    onChange={this.handleInput}
                    placeholder='hh:mm'
                />
                { focus && <TimePicker 
                    style={{ position: 'absolute', zIndex: 999, }}
                    initialDate={selectedTime}
                    tabIndex="0" locale={locale}
                    onPickTime={this.handleTimePick}
                    onCancel={() => { this.handleKeyDown({key: 'Escape'}) }}
                /> }
            </div>
        )
    }
}
InputWithTimePicker.propTypes = {
    value: PropTypes.string,
    initialTime: PropTypes.instanceOf(Date),
    format: PropTypes.shape({
        hour: PropTypes.oneOf(hoursFormats),
        minute: PropTypes.oneOf(minutesFormats),
    }),
    locale: PropTypes.string,
    validator: PropTypes.oneOfType([
        PropTypes.instanceOf(RegExp),
        PropTypes.func
    ]),
}
InputWithTimePicker.defaultProps = {
    format: {
        hour: '2-digit',
        minute: '2-digit',
    },
    locale: 'fr-FR',
    validator: /^\d{2}:\d{2}/,
}

export default InputWithTimePicker