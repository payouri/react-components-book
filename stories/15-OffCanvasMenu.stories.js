import React from 'react'
import OffCanvasMenu from '../src/components/OffCanvasMenu/OffCanvasMenu'

export default {
    title: 'OffCanvas Menu',
    component: OffCanvasMenu,
}
export const Left = () => (
    <OffCanvasMenu />
)
export const Right = () => (
    <OffCanvasMenu side="right" />
)