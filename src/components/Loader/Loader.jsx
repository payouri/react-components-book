import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './Loader.scss';

class Loader extends Component {
    render() {
        return (
            <div className={styles['loader-outer']} style={this.props.style}>
                <div className={`${styles['loader']} ${styles[`loader-${this.props.size}`]}`} style={{
                    background: this.props.background,
                    borderColor: this.props.color,
                }}></div>
            </div>
        )
    }
}
Loader.propTypes = {
    background: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object,
    size: PropTypes.oneOf(['sm', 'md', 'lg']).isRequired,
}
Loader.defaultProps = {
    size: 'md'
}

export default Loader;