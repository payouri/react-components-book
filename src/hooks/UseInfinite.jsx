import React, { useEffect, useState } from 'react'
import { debounce } from '@youri-kane/js_utils/EventUtils'

const UseInfinite = () => {

    const handleScroll = debounce(() => {

    }, 75)

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => { window.removeEventListener('scroll', handleScroll) }
    }, [])

    return [];
}

export default UseInfinite