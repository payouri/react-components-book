import React from 'react';
// import scss from '../../'
import styles from './Colors.scss'
console.log(styles)
const BackgroundColor = ({ color, children, colorAsContent, ...rest }) => (
    <div {...rest} className={styles['bg-' + color]}>
        { colorAsContent && styles['bg-' + color] && color || children }
    </div>
)

export default BackgroundColor
