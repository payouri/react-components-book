import "regenerator-runtime/runtime";
import React, { useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types'
import DraggableList from './components/DraggableList/DraggableList';
import ColorPicker from './components/ColorPicker/ColorPicker';
import UseInfinite from './hooks/UseInfinite';

const Wrap = ({ style, ...rest }) => {

    const wrapRef = useRef(null)
    useLayoutEffect(() => {
        const cleanup = UseInfinite(() => { console.log('reached bottom') }, wrapRef.current)
        return () => { cleanup() }
    }, [])

    return (
        <div style={{ boxSizing: 'border-box', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...style }} ref={wrapRef} className="wrap" {...rest} />
    )
}

const App = () => {
    return (
        <>
            <Wrap>
                {/* <DraggableList /> */}
                <ColorPicker />
            </Wrap>
        </>
    )
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('app'));
})