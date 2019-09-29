import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'js/utils'
import { clamp, getFirstTouch } from 'js/functions'
import Image from 'components/Image/Image';

import styles from './Carousel.scss'

/**
 * TODO
 * Indicators, auto slide and looping images 
 * 
*/

// React.lazy()

const Slide = function({ height, width, ...rest }) {

    return (
        <div style={{ height, width, pointerEvents: 'none' }} >
            <Image {...rest} height={height} width={width} lazy={true}/>
        </div>
    )

}
Slide.propTypes = {
    alt: PropTypes.string,
    fallback: PropTypes.string.isRequired,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    index: PropTypes.number,
    srcSet: PropTypes.arrayOf(PropTypes.objectOf({
        url: PropTypes.string.isRequired,
        media: PropTypes.string.isRequired,
        type: PropTypes.string,
    })),
    title: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}

Slide.defaultProps = {
    alt: '',
    srcSet: [],
    title: '',
}

class Carousel extends Component {

    componentDidMount() {

        this.rootBCR = this.rootRef.current && this.rootRef.current.getBoundingClientRect();
        this.setState({
            ready: true,
        })

        window.addEventListener('resize', this._winHandler);

    }

    componentWillUnmount() {
      
        this.rootBCR = this.rootRef.current && this.rootRef.current.getBoundingClientRect();
        this.setState({
            ready: true,
        })

        window.removeEventListener('resize', this._winHandler);

    }
    
    onWindowResize() {

        this.rootBCR = this.rootRef.current.getBoundingClientRect();

    }

    constructor(props) {

        super(props)

        const { initialIndex, width } = this.props;

        this.rootRef = React.createRef();
        this.rootBCR = null;

        this.width = width;

        this.state = {
            index: initialIndex,
            startX: 0,
            currentX: 0,
            dragged: false,
            ready: false,
        }

        this.handleMouse = this.handleMouse.bind(this);
        this._calcTranslate = this._calcTranslate.bind(this);
        this._calcWidth = this._calcWidth.bind(this);
        this._calcOpacity = this._calcOpacity.bind(this);
        this._calcScale = this._calcScale.bind(this);
        this._dragDir = this._dragDir.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this._winHandler = debounce(this.onWindowResize, 75, false);
        
    }

    handleMouse(mouseEvent) {

        const { type } = mouseEvent;
        const { dragged } = this.state;
        let { screenX } = mouseEvent;

        const isTouch = type.includes('touch');
        
        if(isTouch) { 
            // mouseEvent.persist();
            screenX = isTouch ? getFirstTouch(mouseEvent)['screenX'] : screenX;
        }
        if((type == 'mousedown' || type == 'touchstart') && screenX)
            this.setState({
                startX: screenX,
                currentX: screenX,
                dragged: true,
            })
        else if((type == 'mouseup' || type == 'mouseleave' || type == 'touchend' || type == 'touchcancel') && dragged)
            this.setState({
                startX: 0,
                currentX: 0,
                dragged: false,
            })
        else if((type == 'mousemove' || type == 'touchmove') && dragged) {
            this.setState({
                currentX: screenX,
            }, () => {
                
                const { currentX, startX, index } = this.state,
                    { images, dragThreshold } = this.props;

                const releaseEvent = new Event('mouseup');

                if(currentX - startX < dragThreshold * -1) {

                    this.setState({
                        index: index < images.length - 1 ? index + 1 : index,
                        startX: 0,
                        currentX: 0,
                        dragged: false,
                    }, () => {
                        
                        this.rootRef.current.dispatchEvent(releaseEvent);

                    })
                    

                } else if(currentX - startX > dragThreshold) {

                    this.setState({
                        index: index > 0 ? index - 1 : index,
                        startX: 0,
                        currentX: 0,
                        dragged: false,
                    }, () => {
                        
                        this.rootRef.current.dispatchEvent(releaseEvent);

                    })

                }

            })
        }

    }
    _calcWidth() {
        let { width } = this.props;
        
        if(typeof width == 'number')
            return width;

        else if(typeof width == 'string') {
            if(width === '100%' && this.rootBCR) {
                
                width = this.rootBCR.width;

            }
            else if(width.includes('%') && this.rootBCR) {

                width = this.rootBCR.width * parseFloat(width) / 100;

            } 
        }
        return width;
    }
    _calcOpacity(index) {

        const { startX, currentX } = this.state;
        const { dragThreshold } = this.props;

        if(Math.abs(index) == 1)
            return Math.abs(currentX - startX) / dragThreshold;
        else
            return 1 - Math.abs(currentX - startX) / dragThreshold * .2;

    }
    _calcScale(index) {

        if(index != -1 && index != 1)
            return 1;

        const { startX, currentX } = this.state;
        const { dragThreshold } = this.props;
        
        const n = .75 + Math.abs(currentX - startX) / dragThreshold * .25;
        return clamp(n, .8, 1);

    }
    _calcTranslate(index) {
        
        const { startX, currentX } = this.state;
        const width = this._calcWidth();

        return isNaN(width * index + currentX - startX) ? '0' : `${width * index + currentX - startX}`;

    }
    _dragDir() {

        const { startX, currentX } = this.state;

        if(currentX - startX == 0) return null;
        
        return currentX - startX > 0 ? 1 : -1;

    }
    render() {

        const { height, width, images } = this.props;
        const { dragged, index, ready } = this.state;
    
        return (

            <div ref={this.rootRef} className={styles['carousel-outer']}
                style={{
                    height,
                    width: width,
                    maxWidth: width,
                    cursor: dragged ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    position: 'relative',
                }}
                onMouseDown={this.handleMouse}
                onMouseMove={this.handleMouse}
                onMouseUp={this.handleMouse}
                onMouseLeave={this.handleMouse}
                onTouchCancel={this.handleMouse}
                onTouchEnd={this.handleMouse}
                onTouchMove={this.handleMouse}
                onTouchStart={this.handleMouse}
            >
                { ready
                    ? images.map((image, i) => (
                        <div key={i} style={{ 
                            position: 'absolute', 
                            top: 0, left: 0, right: 0, bottom: 0,
                            transform: `translate(${this._calcTranslate( i - index ) + 'px'}) scale(${this._calcScale(i - index)})`,
                            transition: !dragged ? 'transform .275s ease-in-out, opacity .275s ease' : 'unset',
                            opacity: dragged && 
                                (index > 0 || this._dragDir() == -1) && 
                                (index < images.length - 1 || this._dragDir() == 1) && 
                                (Math.abs(i - index) == 1 || i - index == 0) 
                                    ? this._calcOpacity(i - index) 
                                    : 1,
                        }}>
                            { 
                                typeof image == 'string'
                                    ? <Slide fallback={image} index={i} height={'100%'} width={'100%'} />
                                    : <Slide {...image} index={i} height={'100%'} width={'100%'} />
                            }
                        </div>
                    ))
                    : <div></div>
                }
            </div>

        )

    }
}
const { alt, index, srcSet, title, fallback } = Slide.propTypes;
Carousel.propTypes = {
    dragThreshold: PropTypes.number.isRequired,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    images: PropTypes.arrayOf(PropTypes.shape({ alt, index, srcSet, title, fallback })),
    initialIndex: PropTypes.number,
    transition: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}
Carousel.defaultProps = {
    dragThreshold: 120,
    height: 650,
    initialIndex: 0,
    width: '100%',
    images: [
        {
            fallback: 'https://images.unsplash.com/photo-1558507676-92c16503cd4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80'
        }, 
        {
            fallback: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80'
        }, 
        {
            fallback: 'https://images.unsplash.com/photo-1568195745633-f9ab58b26519?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80'
        }, 
        {
            fallback: 'https://images.unsplash.com/photo-1568452329410-e8188aa8e2b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1900&q=80'
        }, 
        {
            fallback: 'https://images.unsplash.com/photo-1558507676-92c16503cd4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80'
        },
    ],
}


export default Carousel;
