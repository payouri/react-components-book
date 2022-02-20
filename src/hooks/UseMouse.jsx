import { useEffect, Dispatch } from 'react'

const UseWindowMouse = (callback, observed) => {
    const handleTouch = ({ touches, type, ...touchEvent }) => {
        if(touches && touches[0]) {
            callback({
                ...Object.assign({}, {
                    screenX: touches[0].screenY,
                    screenY: touches[0].screenY,
                    clientX: touches[0].clientX,
                    clientY: touches[0].clientY,
                    pageX: touches[0].pageX,
                    pageY: touches[0].pageY,
                    radiusX: touches[0].radiusX,
                    radiusY: touches[0].radiusY,
                    rotationAngle: touches[0].rotationAngle,
                    force: touches[0].force,
                }),
                ...touchEvent,
                type,
                touches,
            })
            return
        }
        callback({
            ...touchEvent,
            touches,
            type,
        })
    } 
    useEffect(() => {
        window.addEventListener('mousemove', callback)
        window.addEventListener('mouseup', callback)
        window.addEventListener('mouseleave', callback)
        window.addEventListener('touchmove', handleTouch)
        window.addEventListener('touchend', handleTouch)
        window.addEventListener('touchcancel', handleTouch)
        return () => {
            window.removeEventListener('mousemove', callback)
            window.removeEventListener('mouseup', callback)
            window.removeEventListener('mouseleave', callback)
            window.removeEventListener('touchmove', handleTouch)
            window.removeEventListener('touchend', handleTouch)
            window.removeEventListener('touchcancel', handleTouch)
        }
    }, observed)
}

export default UseWindowMouse
