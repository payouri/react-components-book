import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styles from './ColorPicker.scss'
import { clamp } from '@youri-kane/js_utils/MathUtils'
import Icon from '../Icon/Icon'
import UseWindowMouse from '../../hooks/UseMouse'
const AlphaHandle = ({ handleMouse, alpha, angle }) => {

    return (
        <div
            onTouchStart={handleMouse}
            onMouseDown={handleMouse}
            onDoubleClick={e => { e.preventDefault() }}
            onDragStart={e => { e.preventDefault }}
            className={styles['alpha-picker']} style={{ 
                '--opacity': alpha, transform: `rotate(${angle}rad)`
            }}
        />
    )

}

AlphaHandle.propTypes = {
    handleMouse: PropTypes.func,
    alpha: PropTypes.number,
    angle: PropTypes.number,
}

const ColorRange = ({ onInput, color, value }) => {

    return (
        <div className={`${styles['individual-color-picker']} ${styles[color]}`} style={{}}>
            <input onChange={({ target }) => { onInput(color, Number(target.value)) }} onInput={({ target }) => { onInput(color, Number(target.value)) }} type="range" min="0" max="255" value={value}></input>
        </div>
    )

}

ColorRange.propTypes = {
    onInput: PropTypes.func,
    color: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

const ColorPicker = ({ onColorChange, initRed = 30, initGreen = 245, initBlue = 245, initAlpha = 1 }) => {
    const r = 109.28
    const offsetAngle = Math.PI * 2

    const [dragged, setDragged] = useState(false)
    const [angle, setAngle] = useState(offsetAngle + Math.asin((r / 2) * initAlpha / r))

    const [red, setRed] = useState(initRed)
    const [green, setGreen] = useState(initGreen)
    const [blue, setBlue] = useState(initBlue)
    const [alpha, setAlpha] = useState(initAlpha)

    const pickerRef = useRef()
    const displayRef = useRef()
    
    useEffect(() => {
        setAlpha(clamp((offsetAngle - angle) * -1 + r / (r * 2), 0, 1))
        return () => { }
    }, [angle])

    const handleMouse = e => {
        const { type, clientY } = e
        if (type === 'mousedown' || type === 'touchstart')
            setDragged(true)
        else if (type === 'mouseup' || type === 'mouseleave' || type === 'touchcancel' || type === 'touchend')
            setDragged(false)
        else if ((type === 'mousemove' || type === 'touchmove') && dragged) {
            const { height, top } = displayRef.current.getBoundingClientRect()
            const cy = top + height / 2
            const y = clamp(clientY - cy, r / -2, r / 2)
            setAngle(-1 * Math.asin(y / r) + offsetAngle)
        }
        typeof onColorChange == 'function' && onColorChange({ red, green, blue, alpha })
    }
    
    UseWindowMouse(handleMouse, [dragged])

    const handleInput = (color, value) => {
        switch (color) {
            case 'red':
                setRed(value)
                break;
            case 'green':
                setGreen(value)
                break;
            case 'blue':
                setBlue(value)
                break;
            default:
        }
        typeof onColorChange == 'function' && onColorChange({ red, green, blue, alpha })
    }

    return (
        <div className={styles['picker-outer']}>
            <div className={styles['picker-wrapper']} ref={pickerRef}>
                <div className={styles['color-display']} ref={displayRef} style={{ backgroundColor: `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(2)})` }}></div>
                <AlphaHandle handleMouse={handleMouse} alpha={alpha} angle={angle} />
                <div className={styles['color-pickers']}>
                    <ColorRange color='red' value={red} onInput={handleInput} />
                    <ColorRange color='green' value={green} onInput={handleInput} />
                    <ColorRange color='blue' value={blue} onInput={handleInput} />
                </div>
            </div>
            <div className={styles['color-copier']}>
                <Icon name='copy' /><span>{`rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(2)})`}</span>
            </div>
        </div>
    )
}

ColorPicker.propTypes = {
    onColorChange: PropTypes.func,
    initAlpha: PropTypes.number,
    initBlue: PropTypes.number,
    initRed: PropTypes.number,
    initGreen: PropTypes.number
}

export default ColorPicker