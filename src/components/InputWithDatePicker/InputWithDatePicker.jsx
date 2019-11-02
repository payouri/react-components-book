import React, { Component } from 'react'
import PropTypes from 'prop-types';
import DatePicker from '../DatePicker/DatePicker'
import Input from 'components/Input/Input'
import { monthsFormats, yearFormats, daysFormats } from '../../commons/js/date';

import styles from './InputWithDropdown.scss';
export class InputWithDatePicker extends Component {

    constructor(props) {
        
        super(props)

        const { value } = this.props;

        this.inputRef = React.createRef();

        this.state = {
            focus: false,
            value: value || '',
            selectedDate: undefined,
        }

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
    handleDatePick(date) {

        const { locale, format } = this.props;

        clearTimeout(this.timeOut);
        this.setState({
            focus: false,
            selectedDate: date,
            value: date.toLocaleDateString(locale, format),
        })

    }
    handleKeyDown({ key }) {
        
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
    _validateDate(date) {

        const { validator } = this.props;

        if(date instanceof Date && !isNaN(date))
            return true;
        else if(typeof date == 'string') {

            if(validator instanceof RegExp)
                return validator.test(date);
            else if(typeof validator == 'function') 
                return validator(date);
        }

    }
    handleInput(value, valid, e) {

        this.setState({
            value,
        })

    }
    render() {

        const { locale, validator } = this.props
        const { focus, value, selectedDate } = this.state;

        return (
            <div className={styles["input-with-date-picker"]} 
                onFocus={this.handleFocus} 
                onBlur={this.handleBlur} 
                onKeyDown={ this.handleKeyDown }>
                <Input 
                    pattern={validator instanceof RegExp ? validator.toString().substring(1, validator.toString().length - 1) : undefined}
                    value={value}
                    inputRef={this.inputRef}
                    onChange={this.handleInput}
                    placeholder='jj/mm/aaaa'
                />
                { focus && <DatePicker style={{ position: 'absolute', zIndex: 999, }} initialDate={selectedDate} tabIndex="0" locale={locale} onDateClick={this.handleDatePick} onCancel={() => { this.handleKeyDown({key: 'Escape'}) }} /> }
            </div>
        )
    }
}

InputWithDatePicker.propTypes = {
    value: PropTypes.string,
    format: PropTypes.shape({
        day: PropTypes.oneOf(daysFormats),
        month: PropTypes.oneOf(monthsFormats),
        year: PropTypes.oneOf(yearFormats)
    }),
    locale: PropTypes.string,
    validator: PropTypes.oneOfType([
        PropTypes.instanceOf(RegExp),
        PropTypes.func
    ]) 
}

InputWithDatePicker.defaultProps = {
    format: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    },
    locale: 'fr-FR',
    validator: /^\d{2}\/\d{2}\/\d{4}$/
}

export default InputWithDatePicker
