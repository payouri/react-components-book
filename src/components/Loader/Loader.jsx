import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './Loader.scss';

class Loader extends Component {
    render() {
        return (
            <div className={styles['loader-outer']}>
                <div className={styles['loader']} style={{
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
}


export default Loader;