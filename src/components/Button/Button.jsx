import React from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon/Icon'

const Button = ({ icon, children, iconStyle, ...rest }) => {

    return (
        <button { ...rest }>
            {
                icon && <Icon name={icon} style={{ marginRight: '.5rem', iconStyle,}} />
            }
            { children }
        </button>
    )

}
export default Button

Button.propTypes = {
    icon: Icon.propTypes.name,
    children: PropTypes.element,
    iconStyle: PropTypes.object
}