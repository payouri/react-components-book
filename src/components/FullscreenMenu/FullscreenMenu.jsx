import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Icon from '../Icon/Icon'
import Button from '../Button/Button'
import styles from './FullscreenMenu.scss'
const FullScreenMenu = ({ onMenuOpen, ref, onMenuClose, isOpen, entries, wrapperStyle, routerLinkOpts, closeButtonStyle, onCloseClick, style, onLinkClick, ...rest }) => {

    const wrapperRef = ref || useRef(null)

    const handleTransition = e => {
        const { target } = e;
        if(target == wrapperRef.current)
            target.classList.contains(styles['open']) ? typeof onMenuOpen == 'function' && onMenuOpen(wrapperRef) : typeof onMenuClose == 'function' && onMenuClose(wrapperRef)
            
    }

    return (
        <div ref={wrapperRef} onTransitionEndCapture={handleTransition} className={`${styles['menu']} ${ isOpen ? styles['open'] : ''}`} style={{ position: 'fixed', left: 0, right: 0, bottom: 0, top: 0, ...wrapperStyle }} {...rest}>
            <nav className={styles['nav']} style={style}>
                { entries.map((entry, index) => (
                    <Link className={styles['link']} key={entry.pathname + index} {...routerLinkOpts} {...entry} onClick={onLinkClick}>
                        { entry.label }
                    </Link>
                )) }
            </nav>
            <Button className={styles['close']} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', ...closeButtonStyle }} onClick={onCloseClick}>
                <Icon name={'times'} />
            </Button>
        </div>
    )
}

FullScreenMenu.propTypes = {
    style: PropTypes.object,
    closeButtonStyle: PropTypes.object,
    wrapperStyle: PropTypes.object,
    routerLinkOpts: PropTypes.object,
    onCloseClick: PropTypes.func,
    onLinkClick: PropTypes.func,
    onMenuOpen: PropTypes.func,
    onMenuClose: PropTypes.func,
    entries: PropTypes.arrayOf(PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        ...Link.propTypes,
    })),
    isOpen: PropTypes.bool,
}

FullScreenMenu.defaultProps = {
    style: {},
    closeButtonStyle: {},
    wrapperStyle: {},
    routerLinkOpts: {},
    entries: [
        { 
            pathname: '/',
            label: 'Home',
            to: '/',
        },
        { 
            pathname: '/',
            label: 'Products',
            to: '/',
        },
        { 
            pathname: '/',
            label: 'Our Team',
            to: '/',
        },
        { 
            pathname: '/',
            label: 'About',
            to: '/',
        },
    ],
    isOpen: false,
}

export default FullScreenMenu