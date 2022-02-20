import React from 'react'
import Colors from '../src/components/Colors/Colors'

export default {
    title: 'Colors',
    component:  Colors
}
const boxes = {
    height: 150,
    width: 150,
}
export const Backgrounds = () => (
    <>
        <Colors style={boxes} color='blue' colorAsContent />
        <Colors style={boxes} color='red' colorAsContent />
        <Colors style={boxes} colorAsContent />
        <Colors style={boxes} colorAsContent />
        <Colors style={boxes} colorAsContent ><button></button></Colors>
    </>
)
