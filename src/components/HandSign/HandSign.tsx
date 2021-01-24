import { mouseTouchOffset } from '@youri-kane/js_utils/src/OtherUtils'
import React, { useState, useRef, useEffect } from 'react'
import Icon from 'components/Icon/Icon'

const wrapperStyles = {
    overflow: 'hidden',
    position: 'relative',
    paddingLeft: '3rem',
    // border: '1px solid #000',
    boxShadow: '0 1px 2px 1px rgba(18, 18, 18, .125)',
    display: 'inline-block',
    backgroundColor: '#ededed',
    borderRadius: '.25rem',
}
const commonBtnStyles = {
    position: 'absolute',
    height: '2.5rem',
    width: '2.5rem',
    textAlign: 'center',
    padding: '0rem',
    borderRadius: '50%',
    border: '2px solid rgba(24, 24, 24, .3)',
    boxShadow: '0px -1px rgba(24, 24, 24, .125), 1px 1px rgba(24, 24, 24, .125), -1px 2px rgba(24, 24, 24, .125), 0px 2px rgba(24, 24, 24, .125)',
    outline: 0,
    left: '0.25rem',
}
const iconStyles = {
    verticalAlign: 'middle',
    color: 'white',
}

function HandSign({ onValidateSignature, height, width, minDistanceBetweenTwoPoints, backgroundColor, validBtnBackground, resetBtnBackground, exportMIME, lineCap, lineJoin, lineWidth, imageSmoothingQuality, }) {

    const [date, setDate] = useState(null)
    const [active, setActive] = useState(false)
    const [points, setPoints] = useState([])
    const [segment, setSegment] = useState([])
    const canvasRef = useRef(null)
    const ctx = useRef(null)
    const contextOpts = {
        lineCap,
        lineJoin,
        lineWidth,
        imageSmoothingQuality
    }

    useEffect(() => {
        ctx.current = canvasRef.current.getContext('2d')
        for (let opt in contextOpts) {
            ctx.current[opt] = contextOpts[opt]
        }
        ctx.current.fillStyle = backgroundColor;
        ctx.current.fillRect(0, 0, width, height);
    }, [])
    const validateSignature = () => {
        const onAccessGranted = function (locationInfos) {
            const { current } = ctx
            setDate(Date.now())
            current.save();
            current.font = '18px monospace';
            current.lineWidth = 0;
            current.fillStyle = "rgb(24, 24, 24)";
            current.fillText(new Date(date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                // hour: '2-digit',
                // minute: '2-digit'
            }), 10, 20, parseInt(width / 3));
            current.restore();
            typeof onValidateSignature == 'functionbackgroundColor: ' && onValidateSignature({
                imgURL: canvasRef.current.toDataURL(exportMIME),
            })

        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onAccessGranted);
        }
    }
    const resetDrawArea = () => {

        setPoints([])
        ctx.current.fillStyle = backgroundColor;
        ctx.current.fillRect(0, 0, width, height);

    }
    const handleMouse = mouseEvent => {

        const { type } = mouseEvent
        const onMouseUp = function () {

            setActive(false)
            const newSegment = [...segment]
            const newPoints = [...points]
            newPoints.push(newSegment)
            setPoints(newPoints)
            setSegment([])

        }, onMouseDown = function () {
            setActive(true)
            ctx.current.beginPath()

        }, onMouseMove = function () {

            const drawSegment = function (points) {
                if (points.length < 6) {
                    const b = points[0]
                    if(b && b.x && b.y)
                        ctx.current.beginPath(), ctx.current.arc(b.x, b.y, contextOpts.lineWidth / 2, 0, Math.PI * 2, !0), ctx.current.closePath(), ctx.current.fill();
                    return
                }
                ctx.current.beginPath(), ctx.current.moveTo(points[0].x, points[0].y);
                // draw a bunch of quadratics, using the average of two points as the control point
                let i
                const n = points.length
                for (i = 1; i < n - 2; i++) {
                    const c = (points[i].x + points[i + 1].x) / 2,
                        d = (points[i].y + points[i + 1].y) / 2;
                    ctx.current.quadraticCurveTo(points[i].x, points[i].y, c, d)
                }
                ctx.current.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y), ctx.current.stroke()
            }

            if (active) {
                const coordinates = mouseTouchOffset(mouseEvent.nativeEvent)
                const lastPoint = points[points.length - 1];

                const newSegment = [...segment]
                newSegment.push(coordinates)
                setSegment(newSegment)

                drawSegment(segment)
            }

        }

        if (type == 'mousemove' || type == 'touchmove')
            onMouseMove();
        if (type == 'mouseup' || type == 'mouseleave' || type == 'touchend' || type == 'touchcancel')
            onMouseUp();
        if (type == 'mousedown' || type == 'touchstart')
            onMouseDown();
    }

    return (
        <div style={wrapperStyles}>
            <canvas onTouchStart={handleMouse} onTouchMove={handleMouse} onTouchEnd={handleMouse} onTouchCancel={handleMouse} onMouseDown={handleMouse} onMouseMove={handleMouse} onMouseLeave={handleMouse} onMouseUp={handleMouse} ref={canvasRef} height={height} width={width} style={{ display: 'block', height, width, }} />
            <button style={{ ...commonBtnStyles, backgroundColor: resetBtnBackground, top: '.25rem' }} onClick={resetDrawArea}>
                <Icon name="eraser" size="lg" />
            </button>
            <button style={{ ...commonBtnStyles, backgroundColor: validBtnBackground, top: '3.25rem' }} onClick={validateSignature}>
                <Icon name="check" size="lg" />
            </button>
        </div>
    )
}

HandSign.defaultProps = {
    height: 200,
    width: 500,
    minDistanceBetweenTwoPoints: 4,
    backgroundColor: 'white',
    validBtnBackground: 'lightseagreen',
    resetBtnBackground: 'cornflowerblue',
    exportMIME: 'image/png',
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 4,
    imageSmoothingQuality: 'high',
}

export default HandSign