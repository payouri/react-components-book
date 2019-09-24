import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const iconLibrary = library

iconLibrary.add(faChevronLeft, faChevronRight)

const Icon = function({ name }) {
    return <FontAwesomeIcon icon={name} />
}
Icon.propTypes = {
    name: PropTypes.oneOf([
        'chevron-right',
        'chevron-left',
    ])
}

export default Icon;