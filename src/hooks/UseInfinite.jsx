// import { useLayoutEffect, useState } from 'react'
import { debounce } from '@youri-kane/js_utils/EventUtils'

const UseInfinite = (callback, elem, runOnInit = false) => {

    if (!(elem instanceof HTMLElement)) {
        elem = window
    }

    const handleScroll = debounce(({ target }) => {
        if (!target.documentElement) {
            const { height } = target.getBoundingClientRect()
            if (height + target.scrollTop >= target.scrollHeight) {
                callback()
            }
        } else {
            if (window.scrollY + window.outerHeight >= document.body.clientHeight) {
                callback();
            }
        }
    }, 50)


    if (runOnInit) {
        callback()
    }
    elem.addEventListener('scroll', handleScroll)

    return () => { elem.removeEventListener('scroll', handleScroll) }

}

export default UseInfinite