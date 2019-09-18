import "regenerator-runtime/runtime";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Calendar from './components/Calendar/Calendar';

const Test = Calendar;

const componentsArray = [
    Test,
].map((Component, index) => <Component key={index}/>);

class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return componentsArray;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('app'));
})