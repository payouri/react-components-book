import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './Input.scss';

class Input extends Component {

    constructor(props) {
        super(props);

        const { value } = this.props;

        this.state = {
            valid: false,
            value: value,
        }

        this.handleInput = this.handleInput.bind(this);
        this._validate = this._validate.bind(this);

    }
    _validate() {

        const { required, validator } = this.props;
        const { value } = this.state;

        if(required && value.length == 0)
            return false;
        
        if(validator) {

            if(validator instanceof RegExp)
                return validator.test(value);

            else if(typeof validator == 'function')
                return validator(value);    

        }

        return true;

    }
    handleInput(e) {

        const { target } = e;

        this.setState({

            value: target.value,
            valid: this._validate(),

        }, () => {

            const { onChange } = this.props;

            typeof onChange == 'function' && onChange(this.state.value, this.state.valid, e);

        });

    }
    render() {

        const { value } = this.state;

        return (
            <input {...this.props} className={`${styles['input']}`} value={value} onChange={this.handleInput}/>
        )
    }
}

Input.propTypes = {
    required: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    validator: PropTypes.oneOf([
        PropTypes.instanceOf(RegExp),
        PropTypes.func,
    ])
}

Input.defaultProps = {
    value: '',
}

export default Input;