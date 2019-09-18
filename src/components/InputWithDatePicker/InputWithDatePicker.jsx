import React, { Component } from 'react'
import PropTypes from 'prop-types';

export class InputWithDatePicker extends Component {
    constructor(props) {
        
        super(props)

        const { value } = this.props;

        this.state = {
            focus: false,
            value: value || '',
            showDatePicker: false,
        }

    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

InputWithDatePicker.propTypes = {
    value: PropTypes.string,
}

export default InputWithDatePicker
