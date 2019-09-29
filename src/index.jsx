import "regenerator-runtime/runtime";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TimePicker from 'components/TimePicker/TimePicker';
import Input from 'components/Input/Input';
import InputWithDatePicker from 'components/InputWithDatePicker/InputWithDatePicker';
import Carousel from 'components/Carousel/Carousel';
import StoryLike from './components/StoryLike/StoryLike';

// console.log(new Request({...r}));
class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <StoryLike />
                <TimePicker />
                <Input type='number' onChange={(v, valid, e) => console.log(v, valid, e)} />
                <InputWithDatePicker />
                <Carousel />
            </>
        )
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('app'));
})