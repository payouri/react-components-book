import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Image from '../Image/Image'

import styles from './StoryLike.scss';

const Stories = React.forwardRef(function({ peoples, onClick, onMouseDown, onMouseMove, onMouseUp, onMouseLeave }, ref) {

    return (
        <div className={styles['stories-outer']}>
            { /* rounded images in row overflow scroll */ }
            <div ref={ref} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave} className={styles['stories-inner']}>
                { peoples.map((p, index )=> (
                    <div key={index} className={styles['story-wrapper']} onClick={() => { onClick(p.id) }}>
                        <Image lazy={true} loaderSize={'sm'} fallback={p.thumbnail} style={{ userSelect: 'none', pointerEvents: 'none' }} height={'100%'}/>
                    </div>
                )) }
            </div>
        </div>
    )

})
Stories.displayName = 'Stories';
Stories.propTypes = {
    peoples: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        thumbnail: PropTypes.string,
        user: PropTypes.string,
        unseenContent: PropTypes.bool,
    })),
    onClick: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
    onMouseUp: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    // wrapperRef: PropTypes.instanceOf(React.ref)
}
Stories.defaultProps = {
    peoples: [],
}

const OverlayImgIndicator = function({ current, length }) {
    return (
        <div className={styles['indicators-wrapper']}>
            { Array.from({length: length}, (v, k) => {
                return <div key={k} className={k <= current ? `${styles['indicator']} ${styles['active']}` : styles['indicator']}></div>
            }) }
        </div>
    )
}
OverlayImgIndicator.propTypes = {
    current: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
}

const OverlayControls = function({ side, onClick }) {
    return (
        <div style={{ 
            position: "absolute", 
            top: 0, bottom: 0, 
            right: side == 'right' ? 0 : 'unset',
            left: side == 'left' ? 0 : 'unset',
            width: '50%', 
        }} onClick={(e) => {
            e.stopPropagation();
            onClick(side == 'right' ? 1 : -1)}
        }>
        </div>
    )
}
OverlayControls.propTypes = {
    side: PropTypes.oneOf(['right', 'left']),
    onClick: PropTypes.func,
}

class Overlay extends Component {

    static OverlayImgIndicator = OverlayImgIndicator 
    static OverlayControls = OverlayControls 

    componentDidMount() {
        document.body.style.overflow = 'hidden';
    }
    
    componentWillUnmount() {
        document.body.style.overflow = 'auto';
    }

    constructor(props) {
        super(props);

        const { displayIndex } = this.props

        this.state = {
            displayIndex,
        }
        this.onControlClick = this.onControlClick.bind(this);
    }

    onControlClick(n) {

        const { displayIndex } = this.state;
        const { images, onReachStoryEnd } = this.props;

        if(displayIndex + n > -1 && displayIndex + n < images.length)
            this.setState({
                displayIndex: displayIndex + n,
            })
        else
            typeof onReachStoryEnd == 'function' && onReachStoryEnd(n)

    }

    render() {

        const { images, onContainerClick } = this.props;
        const { displayIndex } = this.state;

        return (
            <div onClick={onContainerClick} className={styles['overlay-container']} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, }}>
                <OverlayImgIndicator current={displayIndex} length={images.length} />
                <div className={styles['overlay-image-wrapper']}>
                    <Image fallback={images[displayIndex]} style={{ maxHeight: '100%' }} height={'100%'}/>
                    <OverlayControls side={'left'} onClick={this.onControlClick}/>
                    <OverlayControls side={'right'} onClick={this.onControlClick}/>
                </div>
            </div>
        )
    }
}
Overlay.propTypes = {
    displayIndex: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    onContainerClick: PropTypes.func,
    onReachStoryEnd: PropTypes.func,
}
Overlay.defaultProps = {
    displayIndex: 0,
    images: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80', 
        'https://images.unsplash.com/photo-1528809217021-151305b50e55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80', 
        'https://images.unsplash.com/photo-1568195745633-f9ab58b26519?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80', 
        'https://images.unsplash.com/photo-1568452329410-e8188aa8e2b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1900&q=80', 
        'https://images.unsplash.com/photo-1558507676-92c16503cd4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80',
    ],
}

class StoryLike extends Component {

    static Overlay = Overlay
    static Stories = Stories
    
    constructor(props) {
        super(props)
        this.state = {
            showStory: false,
            dragged: false,
            startX: 0,
            currentX: 0,
        }
        
        this.toggleOverlay = this.toggleOverlay.bind(this)
        this.handleMouse = this.handleMouse.bind(this)

        this.storiesOuterRef = React.createRef()

    }

    handleMouse(mouseEvent) {

        const { type, screenX } = mouseEvent;
        const { dragged, currentX, startX } = this.state;

        if(type == 'mousedown')
            this.setState({
                currentX: screenX,
                dragged: true,
                startX: screenX,
            })
        else if((type == 'mouseup' || type == 'mouseleave') && dragged)
            this.setState({
                currentX: 0,
                dragged: false,
                startX: 0,
            })
        else if(type == 'mousemove' && dragged) {
            this.setState({
                currentX: screenX,
            }, () => {
                
                this.storiesOuterRef.current.scrollBy((currentX - startX) * -1, 0);

            })
        }

    }

    toggleOverlay(force) {

        const { showStory } = this.state

        this.setState({
            showStory: typeof force == 'boolean' ? force : !showStory,
        })

    }
    
    render() {

        const { showStory } = this.state;
        const { storyPeoples } = this.props;

        return (
            <div className={styles['storyLike-container']}>
                <Stories ref={this.storiesOuterRef} onMouseDown={this.handleMouse} onMouseUp={this.handleMouse} onMouseMove={this.handleMouse} onMouseLeave={this.handleMouse} peoples={storyPeoples} onClick={() => { this.toggleOverlay(true) }}/>
                { showStory && <Overlay onContainerClick={() => { this.toggleOverlay(false) }}/> }
            </div>
        )
    }
}
StoryLike.propTypes = {
    storyPeoples: Stories.propTypes.peoples,
    userStoryQuery: PropTypes.func.isRequired,
}
StoryLike.defaultProps = {
    storyPeoples: [
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
        {
            id: 0,
            thumbnail: 'https://images.unsplash.com/photo-1510258791301-4d7ac469cc46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
            user: 'Clara Random',
            unseenContent: true,
        },
    ],
    userStoryQuery: () => {},
}

export default StoryLike