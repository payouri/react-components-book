import React, { Component } from 'react';

const withMouseAwareness = function(WrappedComponent) {

    return class MouseAwarenessWrapper extends Component {

        componentDidMount() {

            window.addEventListener('mousemove', this.handleMouseMove);
            window.addEventListener('touchmove', this.handleMouseMove);
    
        }
    
        componentWillUnmount() {
            
            window.removeEventListener('mousemove', this.handleMouseMove);
            window.removeEventListener('touchmove', this.handleMouseMove);
    
        }

        constructor(props) {
            super(props)
    
            this.state = {
    
                clientX: undefined,
                clientY: undefined,
                screenX: undefined,
                screenY: undefined,
    
            }
    
            this.windowListener = null;

            this.handleMouseMove = this.handleMouseMove.bind(this);
    
        }
    
        handleMouseMove({clientX, clientY, screenX, screenY, type, touches}) {
    
            if(type == 'mousemove')
                this.setState({
                    clientX,
                    clientY,
                    screenX,
                    screenY,
                })
            else {

                const { clientX, clientY, screenX, screenY, } = touches[0];
                this.setState({
                    clientX,
                    clientY,
                    screenX,
                    screenY,
                })

            }
                
    
        }

        render() {
    
            return <WrappedComponent { ...this.state } { ...this.props } />
    
        }

    }

}

export default withMouseAwareness;