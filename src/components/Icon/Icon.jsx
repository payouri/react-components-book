import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { faChevronLeft, faChevronRight, faChevronUp, faChevronDown, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const iconLibrary = library

iconLibrary.add(faChevronLeft, faChevronRight, faChevronDown, faChevronUp, faTrash, faTrashAlt)

const Icon = function({ name }) {
    return <FontAwesomeIcon icon={name} />
}
Icon.propTypes = {
    name: PropTypes.oneOf([
        'chevron-right',
        'chevron-left',
        'chevron-up',
        'chevron-down',
        'trash',
        'trash-alt',
    ])
}

export default Icon;