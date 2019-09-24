import React, { Component } from 'react'
import PropTypes from 'prop-types'

const formatHeaders = function(headerObj) {
    
    return headerObj ? Object.keys(headerObj).reduce((acc, h) => acc += `${h}:${headerObj[h]};`, '') : undefined;

}

const DataFetch = function(WrappedComponent) {
    class DataFetcher extends Component {
        async componentDidMount() {
            
            this.controller = new AbortController();
            this.abortSignal = this.controller.signal;

            const { url, headers, mode, body, credentials, method, onFetchError, onBadResponse, onResponse } = this.props;

            try {
                const response = await fetch(url, {
                    body,
                    credentials,
                    headers: formatHeaders(headers),
                    method,
                    mode,
                    signal: this.abortSignal,
                })

                if(!response.ok)
                    typeof onBadResponse == 'function' && onBadResponse(response);
            
                const contentType = response.headers.get('Content-Type');
                let data;
                
                if(typeof onResponse == 'function') {
                    
                    data = await onResponse(response);

                } else {
                    if(contentType.indexOf('json')) {
                        data = await response.json();
                    } else {

                        data = await response.text();

                    }
                }
                
                this.setState({
                    data,
                })

            } catch (fetchErr) {
                // console.log(fetchErr);
                typeof onFetchError == 'function' && onFetchError(fetchErr);

            }

        }
        componentWillUnmount() {
            
            this.controller.abort();

        }
        constructor(props) {
            
            super(props);
            
            this.controller = null;
            this.abortSignal = null;

            this.state = {
                data: null,
            }

        }
        render() {
            
            const { url, headers, body, credentials, propToFeed, onResponse, onBadResponse, onFetchError, ...rest } = this.props; // eslint-disable-line no-unused-vars
            const { data } = this.state;
            
            rest[propToFeed] = data;

            return (
                <WrappedComponent {...rest}/>
            )
        }
    }
    DataFetcher.propTypes = {
        body: PropTypes.any,
        credentials: PropTypes.oneOf([ 'omit', 'same-origin', 'include' ]).isRequired,
        headers: PropTypes.objectOf(PropTypes.string.isRequired),
        method: PropTypes.string.isRequired,
        mode: PropTypes.oneOf(['cors', 'no-cors', 'same-origin', 'navigate']),
        onResponse: PropTypes.func,
        onBadResponse: PropTypes.func,
        onFetchError: PropTypes.func,
        propToFeed: PropTypes.string,
        url: PropTypes.string.isRequired,
    }
    DataFetcher.defaultProps = {
        credentials: 'omit',
        method: 'GET',
        propToFeed: 'data',
    }
    return DataFetcher;
}

export default DataFetch;