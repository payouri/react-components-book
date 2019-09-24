import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loader from 'components/Loader/Loader';

class Image extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        }
        this.onLoad = this.onLoad.bind(this);
    }

    onLoad() {
        this.setState({
            loaded: true,
        })
    }

    render() {

        const { height, width, fallback, srcSet, alt, style, ...rest } = this.props;
        const { loaded } = this.state;

        return (
            <picture onLoad={this.onLoad} {...rest} style={{ maxWidth: '100%', height, width,}}>
                { srcSet.map(({ url, media, type }, i) => <source key={i} srcSet={url} media={media} type={type}/> )}
                <img src={fallback} alt={alt} height={height} width={width} style={{ maxWidth: '100%', objectFit: 'cover', ...style, height, width, }}/>
                { ! loaded && <Loader /> }
            </picture>
        )
    }
}
Image.propTypes = {
    alt: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    fallback: PropTypes.string.isRequired,
    srcSet: PropTypes.arrayOf(PropTypes.objectOf({
        url: PropTypes.string.isRequired,
        media: PropTypes.string.isRequired,
        type: PropTypes.string,
    })),
    style: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}
Image.defaultProps = {
    height: 'auto',
    style: {},
    srcSet: [],
    width: '100%',
}

export default Image;