import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { clamp } from '../../commons/js/functions';
import styles from './OffCanvasMenu.scss';
/*
    TODO

    overall styling
    add possibility to auto gen menu items and style them

*/

const BodyMenuItem = ({ text, onClick, disabled }) => {
    if( disabled )
        return <li className='menu-item disabled'>{text}</li>
    else    
        return <li className='menu-item' onClick={onClick}>{text}</li>;
}

BodyMenuItem.propTypes = {

    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,

}

const HeadMenuItem = ({ text, icon, onClick, disabled }) => {
    if( disabled )
        return <li className='menu-item disabled'>{text}</li>
    else    
        return <li className='menu-item' onClick={onClick}>{icon}{text}</li>;
}

HeadMenuItem.propTypes = {

    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,

}

class OffCanvasMenu extends Component {

    static BodyMenuItem = BodyMenuItem;
    static HeadMenuItem = HeadMenuItem;

    componentDidMount() {
        
        window.addEventListener('click', this.handleWindowOutsideClick);
        window.addEventListener('mousemove', this.handleMouse);
        window.addEventListener('mouseup', this.handleMouse);
        window.addEventListener('touchmove', this.handleMouse);
        window.addEventListener('touchcancel', this.handleMouse);
        window.addEventListener('touchend', this.handleMouse);
    }

    componentWillUnmount() {
        
        window.removeEventListener('click', this.handleWindowOutsideClick);
        window.removeEventListener('mousemove', this.handleMouse);
        window.removeEventListener('mouseup', this.handleMouse);
        window.removeEventListener('touchmove', this.handleMouse);
        window.removeEventListener('touchcancel', this.handleMouse);
        window.removeEventListener('touchend', this.handleMouse);

    }

    constructor(props) {

        super(props);
        
        const { open = false, } = this.props;

        this.state = {
            dragged: false,
            open,
            startX: 0,
            currentX: 0,
        };

        this.handleMouse = this.handleMouse.bind(this);
        this.handleWindowOutsideClick = this.handleWindowOutsideClick.bind(this);

        this.containerRef = React.createRef();

    }
    handleWindowOutsideClick({ target }) {
        
        if(!this.containerRef.current.contains(target))

            this.setState({
                open: false,
            })

    }
    handleMouse(mouseEvent) {

        const { dragged, currentX, startX, open } = this.state,
            { dragThreshold, side } = this.props;
        const { type, touches } = mouseEvent;

        const screenX = type.indexOf('touch') > -1 ? touches && touches[0] && touches[0].screenX ? touches[0].screenX : 0 : mouseEvent.screenX;

        if(type == 'mousedown' || type == 'touchstart') {
            this.setState({
                dragged: true,
                startX: screenX,
                currentX: screenX,
            })
        } else if(type == 'mouseup' || type == 'touchcancel' || type == 'touchend') {
            this.setState({
                dragged: false,
            })
        } else if((type == 'mousemove' || type == 'touchmove') && dragged) {
            this.setState({
                currentX: screenX,
            }, () => {
                const releaseEvent = new Event(type == 'mousemove' ? 'mouseup' : 'touchend');
                
                const dist = side == 'left'
                    ? open
                        ? (currentX - startX) * -1
                        : currentX - startX
                    : open
                        ? currentX - startX
                        : (currentX - startX) * -1

                if(dist >= dragThreshold) {
                    this.setState({
                        open: !open,
                    })
                    window.dispatchEvent(releaseEvent);
                }
            })
        }

    }
    render() {

        const { side, dragThreshold, children } = this.props,
            { open, startX, currentX, dragged } = this.state;

        const transformType = side == 'left' 
            ? open 
                ? `translateX(${clamp(currentX - startX, -1 * dragThreshold, 0)}px)` 
                : `translateX(calc(-100% + ${clamp(currentX - startX, 0, dragThreshold)}px))` 
            : open 
                ? `translateX(calc(-100% + ${clamp(currentX - startX, 0, dragThreshold)}px))`
                : `translateX(calc(${clamp(currentX - startX, -1 * dragThreshold, 0)}px))`,
            containerInteractionStyles = { transform: transformType, transition: 'unset', cursor: 'grabbing' };

        return (
            <div 
                className={styles['ocMenu']} 
                data-side={side} 
                data-open={open ? 'open' : ''}
                onMouseDown={this.handleMouse}
                onMouseMove={this.handleMouse}
                onTouchCancel={this.handleMouse}
                onTouchStart={this.handleMouse}
                ref={ this.containerRef } 
                style={ dragged ? containerInteractionStyles : undefined }
            >
                <div className='menu-inner'>
                    { children }
                </div>
                <div className={styles['grabzone']}></div>
            </div>
        );
    }
}

OffCanvasMenu.propTypes = {

    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]),
    open: PropTypes.bool,
    dragThreshold: PropTypes.number,
    side: PropTypes.oneOf([
        'left',
        'right',
    ]).isRequired,

}

OffCanvasMenu.defaultProps = {

    open: true,
    dragThreshold: 40,
    side: 'left',

}

export default OffCanvasMenu;