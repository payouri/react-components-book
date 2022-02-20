import React, { Component, CSSProperties, RefObject } from "react";
import PropTypes from "prop-types";
import Loader, { LoaderProps } from "components/Loader/Loader";

const onImageEnter: IntersectionObserverCallback = function (entries) {
  for (const entry of entries) {
    const { target, isIntersecting } = entry as IntersectionObserverEntry & {
      target: HTMLImageElement & EventTarget;
    };

    if (isIntersecting && target) {
      target.src = target.dataset.src ?? "";
      const sources = Array.from(
        target.parentNode?.querySelectorAll("source") ?? []
      );
      for (let i = 0, n = sources.length; i < n; i++) {
        if (typeof sources[i].dataset.srcSet === "string") {
          sources[i].srcset = sources[i].dataset.srcSet as string;
        }
      }

      ImagesObserver.unobserve(target);
      target.dispatchEvent(new Event("visibilityChanged"));
    }
  }
};
const ImagesObserver = new IntersectionObserver(onImageEnter, {
  threshold: 0.25,
});

interface ImageProps {
  lazy?: boolean;
  height: CSSProperties["height"];
  width: CSSProperties["width"];
  fallback: string;
  srcSet: { url: string; media: string; type: string }[];
  alt?: string;
  style?: CSSProperties;
  loaderStyle?: CSSProperties;
  loaderSize?: LoaderProps["size"];
}

interface ImageState {
  loaded: boolean;
  visible: boolean;
}

export class Image extends Component<ImageProps, ImageState> {
  static defaultProps = {
    height: "auto",
    lazy: false,
    loaderSize: "lg",
    style: {},
    srcSet: [],
    width: "100%",
  };

  static propTypes = {
    alt: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    lazy: PropTypes.bool,
    fallback: PropTypes.string.isRequired,
    srcSet: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        media: PropTypes.string.isRequired,
        type: PropTypes.string,
      })
    ),
    style: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    loaderStyle: PropTypes.object,
    loaderSize: Loader.propTypes.size,
  };

  private imgRef: RefObject<HTMLImageElement>;

  componentDidMount() {
    const { lazy } = this.props;

    if (lazy && this.imgRef.current) {
      // observed++
      ImagesObserver.observe(this.imgRef.current);
      this.imgRef.current.addEventListener(
        "visibilityChanged",
        this.onVisibilityStateChanged
      );
    }
  }

  componentWillUnmount() {
    const { lazy } = this.props;

    if (lazy && this.imgRef.current) {
      // observed--
      ImagesObserver.unobserve(this.imgRef.current);
      this.imgRef.current.removeEventListener(
        "visibilityChanged",
        this.onVisibilityStateChanged
      );
    }
  }

  componentDidUpdate(prevProps: ImageProps) {
    if (
      prevProps.fallback !== this.props.fallback ||
      prevProps.srcSet !== this.props.srcSet
    )
      this.setState({
        loaded: false,
      });
  }

  constructor(props: ImageProps) {
    super(props);
    this.state = {
      loaded: false,
      visible: false,
    };

    this.onLoad = this.onLoad.bind(this);
    this.onVisibilityStateChanged = this.onVisibilityStateChanged.bind(this);
    this.imgRef = React.createRef();
  }

  onLoad() {
    this.setState({
      loaded: true,
    });
  }

  onVisibilityStateChanged() {
    this.setState({
      visible: true,
    });
  }

  render() {
    const {
      height,
      width,
      fallback,
      srcSet,
      alt,
      style,
      loaderStyle,
      lazy,
      loaderSize,
      ...rest
    } = this.props;
    const { loaded, visible } = this.state;

    return lazy && !visible ? (
      <picture
        onLoad={this.onLoad}
        {...rest}
        style={{ maxWidth: "100%", maxHeight: "100%", height, width }}
      >
        {srcSet.map(({ url, media, type }, i) => (
          <source
            key={i}
            srcSet={visible ? url : ""}
            data-src-set={url}
            media={media}
            type={type}
          />
        ))}
        <img
          ref={this.imgRef}
          src={visible ? fallback : ""}
          data-src={fallback}
          alt={alt}
          height={height}
          width={width}
          style={{
            maxWidth: "100%",
            objectFit: "cover",
            ...style,
            height,
            width,
          }}
        />
        {!loaded && <Loader style={loaderStyle} size={loaderSize} />}
      </picture>
    ) : (
      <picture
        onLoad={this.onLoad}
        {...rest}
        style={{ maxWidth: "100%", maxHeight: "100%", height, width }}
      >
        {srcSet.map(({ url, media, type }, i) => (
          <source key={i} srcSet={url} media={media} type={type} />
        ))}
        <img
          ref={this.imgRef}
          src={fallback}
          alt={alt}
          height={height}
          width={width}
          style={{
            maxWidth: "100%",
            objectFit: "cover",
            ...style,
            height,
            width,
          }}
        />
        {!loaded && <Loader style={loaderStyle} size={loaderSize} />}
      </picture>
    );
  }
}

export default Image;
