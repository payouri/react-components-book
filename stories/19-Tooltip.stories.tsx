import React, { useRef, useState } from 'react'
import Tooltip from '../src/components/Tooltip/Tooltip'

export default {
    title: 'Tooltip',
    component: Tooltip,
}
export const Default = () => {
    const ref = useRef(null)
    const [show, setShow] = useState(false)
    return (
        <>
            <span style={{position: 'relative'}}>
                <span onTouchEnd={() => { setShow(false) }} onMouseLeave={() => { setShow(false) }} onTouchStart={() => { setShow(true) }} onMouseEnter={() => { setShow(true) }} ref={ref}>Hover Here</span>
                <Tooltip label="Tooltip" show={show} rootElem={ref.current} offsetX={40} />
            </span>
        </>
    )
}
export const Top = () => {
    const ref = useRef(null)
    const [show, setShow] = useState(false)
    return (
        <>
            <span style={{position: 'relative'}}>
                <span onTouchEnd={() => { setShow(false) }} onMouseLeave={() => { setShow(false) }} onTouchStart={() => { setShow(true) }} onMouseEnter={() => { setShow(true) }} ref={ref}>Hover Here</span>
                <Tooltip position={'top'} label="Tooltip" show={show} rootElem={ref.current}/>
            </span>
        </>
    )
}
export const Bottom = () => {
    const ref = useRef(null)
    const [show, setShow] = useState(false)
    return (
        <>
            <span style={{position: 'relative'}}>
                <span onTouchEnd={() => { setShow(false) }} onMouseLeave={() => { setShow(false) }} onTouchStart={() => { setShow(true) }} onMouseEnter={() => { setShow(true) }} ref={ref}>Hover Here</span>
                <Tooltip position={'bottom'} label="Tooltip" show={show} rootElem={ref.current}/>
            </span>
        </>
    )
}
export const Left = () => {
    const ref = useRef(null)
    const [show, setShow] = useState(false)
    return (
        <>
            <span style={{position: 'relative'}}>
                <span onTouchEnd={() => { setShow(false) }} onMouseLeave={() => { setShow(false) }} onTouchStart={() => { setShow(true) }} onMouseEnter={() => { setShow(true) }} ref={ref}>Hover Here</span>
                <Tooltip position={'left'} label="Tooltip" show={show} rootElem={ref.current}/>
            </span>
        </>
    )
}