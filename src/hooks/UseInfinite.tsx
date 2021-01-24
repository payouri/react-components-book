// import { useLayoutEffect, useState } from 'react'
import { debounce } from '@youri-kane/js_utils/src/EventUtils';

const UseInfinite = (callback: (event: Event) => void, elem: HTMLElement | Window, runOnInit?: () => void) => {

    if (!(elem instanceof HTMLElement)) {
        elem = window
    }

    const handleScroll = debounce(({ target, ...event }: Event) => {
        if (!target) return
        if (!("documentElement" in target) && target instanceof HTMLElement) {
            const { height } = target.getBoundingClientRect()
            if (height + target.scrollTop >= target.scrollHeight) {
                callback({ ...event, target });
            }
        } else {
            if (window.scrollY + window.outerHeight >= document.body.clientHeight) {
                callback({ ...event, target });
            }
        }
    }, 50)


    if (runOnInit) {
        runOnInit()
    }

    elem.addEventListener('scroll', handleScroll)

    return () => { elem.removeEventListener('scroll', handleScroll) }

}

export default UseInfinite