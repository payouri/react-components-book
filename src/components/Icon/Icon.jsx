import React from 'react'
import PropTypes from 'prop-types'
import { faChevronLeft, faCheck, faEraser, faChevronRight, faChevronUp, faChevronDown, faTrash, faTrashAlt, faTimes, faCopy } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const iconLibrary = library

iconLibrary.add(faCheck, faEraser, faChevronLeft, faChevronRight, faChevronDown, faChevronUp, faTrash, faTrashAlt, faTimes, faCopy)

const Icon = function({ name, ...rest }) {
    return <FontAwesomeIcon icon={name} {...rest} />
}
Icon.propTypes = {
    name: PropTypes.oneOf([
        'check',
        'eraser',
        'times',
        'chevron-right',
        'chevron-left',
        'chevron-up',
        'chevron-down',
        'trash',
        'trash-alt',
        'copy'
    ])
}

export default Icon;