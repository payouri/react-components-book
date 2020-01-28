import React from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon/Icon'
import styles from './Button.scss'

const Button = ({ icon, children, iconStyle, size, color, ...rest }) => {

    return (
        <button className={`${styles['button']} ${styles[size]} ${color ? styles['btn-'+color] : ''}`} { ...rest }>
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