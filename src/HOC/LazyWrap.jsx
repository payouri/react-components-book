import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import Loader from '../components/Loader/Loader'
const LazyWrap = ({ path, ...props }) => {

    const Component = lazy(() => import(path))

    return (
        <Suspense fallback={<div style={{height: '100%', width: '100%', position: 'relative',}}><Loader /></div>}>
            <Component {...props}/>
        </Suspense>
    )
}
LazyWrap.propTypes = {
    path: PropTypes.string,
}
export default LazyWrap;