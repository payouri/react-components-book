import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loader from 'components/Loader/Loader';

const onImageEnter = function(entries) {
    
    for(let entry of entries) {
        
        const { target, isIntersecting } = entry;

        if(isIntersecting) {
            
            target.src = target.dataset.src;
            const sources = target.parentNode.querySelectorAll('source');
            for(let i, n = sources.length; i < n; i++) {
                sources[i].srcset = sources[i].dataset.srcSet
            }
            
            ImagesObserver.unobserve(target);
            target.dispatchEvent(new Event('visibilityChanged'))

        }

    }

}
const ImagesObserver = new IntersectionObserver(onImageEnter, {
    threshold: .25,
})

class Image extends Component {

    componentDidMount() {
        
        const { lazy } = this.props;
        
        if(lazy) {
            // observed++
            ImagesObserver.observe(this.imgRef.current);
            this.imgRef.current.addEventListener('visibilityChanged', this.onVisibilityStateChanged)
        }

    }

    componentWillUnmount() {

        const { lazy } = this.props;

        if(lazy) {
            // observed--
            ImagesObserver.unobserve(this.imgRef.current);
            this.imgRef.current.removeEventListener('visibilityChanged', this.onVisibilityStateChanged)
        }

    }

    componentDidUpdate(prevProps) {

        if(prevProps.fallback != this.props.fallback || prevProps.srcSet != this.props.srcSet)
            this.setState({
                loaded: false,
            })

    }

    constructor(props) {

        super(props);
        this.state = {
            loaded: false,
            visible: false,
        }
        
        this.onLoad = this.onLoad.bind(this);
        this.onVisibilityStateChanged = this.onVisibilityStateChanged.bind(this);
        this.imgRef = React.createRef();

    }

    onLoad() {
        this.setState({
            loaded: true,
        })
    }

    onVisibilityStateChanged() {
        
        this.setState({
            visible: true,
        })

    }

    render() {

        const { height, width, fallback, srcSet, alt, style, loaderStyle, lazy, loaderSize, ...rest } = this.props;
        const { loaded, visible } = this.state;

        return lazy && !visible ? (
                <picture onLoad={this.onLoad} {...rest} style={{ maxWidth: '100%', maxHeight: '100%', height, width,}}>
                    { srcSet.map(({ url, media, type }, i) => <source key={i} srcSet={visible ? url : ''} data-src-set={url} media={media} type={type}/> )}
                    <img ref={this.imgRef} src={visible ? fallback : ''} data-src={fallback} alt={alt} height={height} width={width} style={{ maxWidth: '100%', objectFit: 'cover', ...style, height, width, }}/>
                    { !loaded && <Loader style={loaderStyle} size={loaderSize} /> }
                </picture>
            ) : (
                <picture onLoad={this.onLoad} {...rest} style={{ maxWidth: '100%', maxHeight: '100%', height, width,}}>
                    { srcSet.map(({ url, media, type }, i) => <source key={i} srcSet={url} media={media} type={type}/> )}
                    <img ref={this.imgRef} src={fallback} alt={alt} height={height} width={width} style={{ maxWidth: '100%', objectFit: 'cover', ...style, height, width, }}/>
                    { !loaded && <Loader style={loaderStyle} size={loaderSize} /> }
                </picture>
            )
    }
}
Image.propTypes = {
    alt: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    lazy: PropTypes.bool,
    fallback: PropTypes.string.isRequired,
    srcSet: PropTypes.arrayOf(PropTypes.objectOf({
        url: PropTypes.string.isRequired,
        media: PropTypes.string.isRequired,
        type: PropTypes.string,
    })),
    style: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    loaderStyle: PropTypes.object,
    loaderSize: Loader.propTypes.size,
}
Image.defaultProps = {
    height: 'auto',
    lazy: false,
    loaderSize: 'lg',
    style: {},
    srcSet: [],
    width: '100%',
}

export default Image;