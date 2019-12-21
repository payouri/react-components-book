import React from 'react'
import PropTypes from 'prop-types'
import { faChevronLeft, faChevronRight, faChevronUp, faChevronDown, faTrash, faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const iconLibrary = library

iconLibrary.add(faChevronLeft, faChevronRight, faChevronDown, faChevronUp, faTrash, faTrashAlt, faTimes)

const Icon = function({ name, ...rest }) {
    return <FontAwesomeIcon icon={name} {...rest} />
}
Icon.propTypes = {
    name: PropTypes.oneOf([
        'times',
        'chevron-right',
        'chevron-left',
        'chevron-up',
        'chevron-down',
        'trash',
        'trash-alt',
    ])
}

export default Icon;