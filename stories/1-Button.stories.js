import React from 'react'

import { action } from '@storybook/addon-actions'
import Button from '../src/components/Button/Button'

export default {
  title: 'Button',
  component: Button,
}

export const Text = () => <Button onClick={action('clicked')}>Hello Button</Button>
export const Large = () => <Button size='lg' onClick={action('clicked')}>Hello Button</Button>
export const Small = () => <Button size='sm' onClick={action('clicked')}>Hello Button</Button>
export const Colors = () => (
  <>
    <div style={{ margin: '0 .25rem' }}><Button color='purple' onClick={action('clicked')}>Hello Button</Button></div>
    <div style={{ margin: '0 .25rem' }}><Button color='blue' onClick={action('clicked')}>Hello Button</Button></div>
    <div style={{ margin: '0 .25rem' }}><Button color='yellow' onClick={action('clicked')}>Hello Button</Button></div>
    <div style={{ margin: '0 .25rem' }}><Button color='green' onClick={action('clicked')}>Hello Button</Button></div>
    <div style={{ margin: '0 .25rem' }}><Button color='red' onClick={action('clicked')}>Hello Button</Button></div>
  </>
)
export const ButtonIcon = () => <Button icon={'times'} onClick={action('clicked')}>Icon Button</Button>