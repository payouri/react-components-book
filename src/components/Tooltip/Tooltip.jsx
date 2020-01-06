import React, { useEffect, useState } from 'react'
import { Transition } from 'react-transition-group'
import PropTypes from 'prop-types'
import styles from './Tooltip.css'

const Tooltip = ({ label, position, rootElem, show, offsetX, offsetY, style, ...rest }) => {
    const [pos, setPos] = useState({ left: null, top: null, right: null, bottom: null, })
    const [oldPos, setOldPos] = useState({ left: null, top: null, right: null, bottom: null, })

    useEffect(() => {
        if (rootElem) {
            setOldPos(pos)
            setPos(calcPosition())
        } else {
            setOldPos(pos)
            setPos({ left: null, top: null, right: null, bottom: null, })
        }
        return () => { setPos({ left: null, top: null, right: null, bottom: null, }) }
    }, [rootElem])

    const calcPosition = () => {
        const parentBCR = rootElem.parentNode.getBoundingClientRect()
        const bcr = rootElem.getBoundingClientRect()

        switch (position) {
            case 'bottom':
                return ({
                    left: `calc(${bcr.x - parentBCR.x + bcr.width / 2 + offsetX}px)`,
                    top: `calc(${bcr.y - parentBCR.y + bcr.height + offsetY}px)`,
                    right: null,
                    bottom: null,
                })
            case 'left':
                return ({
                    left: `calc(${parentBCR.x - bcr.x - bcr.width / 2}px - 100%)`,
                    top: `calc(${bcr.y - parentBCR.y + bcr.height / 2 + offsetY}px)`,
                    right: null,
                    bottom: null,
                })
            case 'right':
                return ({
                    right: `calc(${parentBCR.x - bcr.x - bcr.width / 2}px - 100%)`,
                    top: `calc(${bcr.y - parentBCR.y + bcr.height / 2 + offsetY}px)`,
                    left: null,
                    bottom: null,
                })
            case 'top':
            default:
                return ({
                    left: `calc(${bcr.x - parentBCR.x + bcr.width / 2 + offsetX}px `,
                    top: `calc(${bcr.y - parentBCR.y + offsetY}px - .625rem)`,
                    right: null,
                    bottom: null,
                })
        }
    }
    const duration = 325
    const transitionStyles = {
        entering: { opacity: 1, ...pos },
        entered: { opacity: 1, ...pos },
        exiting: { opacity: 0, ...oldPos },
        exited: { opacity: 0, ...oldPos},
    }
    return (
        <Transition
            mountOnEnter
            unmountOnExit
            timeout={duration}
            in={show}
            appear
        >
            {state => (
                <div
                    {...rest}
                    className={`${styles['tooltip-outer']} ${styles[position] ? styles[position] : styles['top']}`}
                    style={{
                        ...style,
                        transition: `opacity ${duration}ms ease-in-out`,
                        ...transitionStyles[state]
                    }}
                >
                    {label}
                </div>
            )}
        </Transition>
    )
}

Tooltip.propTypes = {
    label: PropTypes.string,
    position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    rootElem: PropTypes.instanceOf(HTMLElement),
    show: PropTypes.bool,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    style: PropTypes.object,
}

Tooltip.defaultProps = {
    offsetY: 0,
    offsetX: 0,
    position: 'right',
}

export default Tooltip