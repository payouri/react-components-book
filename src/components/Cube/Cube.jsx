import React, { Component } from 'react';
import PropTypes from 'prop-types'

const wrapperStyles = {
    // perspective: 120000,
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform .225s ease'
}
const faceStyles = {
    position: 'absolute',
    backfaceVisibility: 'hidden',
}
const facesTransforms = s => ({
    front: {
        transform: `translateZ(${s/2}px)`,
        backgroundColor: 'red',
    },
    left: {
        transform: `rotateY(270deg) translateX(${s/2 * -1}px)`,
        transformOrigin: 'center left',
        backgroundColor: 'yellow',
    },
    right: {
        transform: `rotateY(-270deg) translateX(${s/2}px)`,
        transformOrigin: 'center right',
        backgroundColor: 'green',
    },
    back: {
        transform: `translateZ(${s/2 * -1}px) rotateX(.5turn)`,
        backgroundColor: 'purple',
    }
})
// const calcSize = 
class Cube extends Component {
    
    static facesAngles = {
        front: 0,
        right: 90,
        back: 180,
        left: 270
    }

    componentDidMount() {
        
        this.wrapperBCR = this.wrapperRef.current.getBoundingClientRect();
        window.addEventListener('resize', this.onWindowResize)
        this.setState({
            ready: true,
        })
    }
    componentWillUnmount() {
        
        window.removeEventListener('resize', this.onWindowResize)

    }
    onWindowResize() {

        this.wrapperBCR = this.wrapperRef.current.getBoundingClientRect();

    }
    constructor(props) {
        
        super(props)

        this.wrapperRef = React.createRef()
        this.wrapperBCR

        this.state = {
            ready: false,
            rotateX: 0,
            rotateY: Cube.facesAngles[this.props.face],
        }

        this._calcPos = this._calcPos.bind(this)
        this.handleMouse = this.handleMouse.bind(this)
        this.changeFace = this.changeFace.bind(this)

    }
    changeFace(keyword) {
        const { rotateY } = this.state
        if(keyword == 'next') {
            this.setState({
                rotateY: rotateY + 90,
            })
        } else if(keyword == 'prev')
            this.setState({
                rotateY: rotateY - 90,
            })
    }
    _calcPos() {
        if(this.wrapperBCR)
            return {
                left: `calc(50% - ${this.wrapperBCR.width/2}px)`,
                top: `calc(50% - ${this.wrapperBCR.height/2}px)`
            }
        else
            return {

            }
    }
    handleMouse(e) {
        
        const { movementX, movementY } = e;
        const { rotateX, rotateY } = this.state

        this.setState({
            rotateX: rotateX + movementY,
            rotateY: rotateY + movementX,
        })
    }
    render() {

        const { size, frontComponent } = this.props;
        const { ready, rotateX, rotateY } = this.state;
        const s = {
            height: size,
            width: size,
            ...this._calcPos()
        }

        return (
            <>
                <div style={{...s}} className="cube-container" /* onMouseMove={this.handleMouse} */>
                    <div ref={this.wrapperRef} style={{...wrapperStyles, top: 0, left: 0, right: 0, bottom: 0, transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`}} className="faces-wrapper">
                    {ready && (
                        <>
                            <div style={{...faceStyles, ...facesTransforms(this.wrapperBCR.width).front, ...s}} className="cube-face front">
                                { frontComponent }
                            </div>
                            <div style={{...faceStyles, ...facesTransforms(this.wrapperBCR.width).right, ...s}} className="cube-face right"></div>
                            <div style={{...faceStyles, ...facesTransforms(this.wrapperBCR.width).back, ...s}} className="cube-face back"></div>
                            <div style={{...faceStyles, ...facesTransforms(this.wrapperBCR.width).left, ...s}} className="cube-face left"></div>
                        </>
                    )}
                    </div>
                </div>
                <div>
                    <button onClick={() => this.changeFace('prev')}>{'<'}</button>
                    <button onClick={() => this.changeFace('next')}>{'>'}</button>
                </div>
            </>
        )
    }
}
Cube.propTypes = {
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    onChangeFace: PropTypes.func,
    frontComponent: PropTypes.element,
    rightComponent: PropTypes.element,
    backComponent: PropTypes.element,
    leftComponent: PropTypes.element,
    face: PropTypes.oneOf(Object.keys(Cube.facesAngles)),
}
Cube.defaultProps = {
    size: '66vmin',
    face: 'front',
}

export default Cube