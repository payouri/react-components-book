import "regenerator-runtime/runtime";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types'
import DraggableList from './components/DraggableList/DraggableList';
import ColorPicker from './components/ColorPicker/ColorPicker';

class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }} className="wrap">
                    {/* <DraggableList /> */}
                    <ColorPicker />
                </div>
            </>
        )
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('app'));
})