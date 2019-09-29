export const clamp = function(number, min, max) {
    return number > max ? max : number < min ? min : number;
}

export const getElementAt = function(iterable, n) {
    if(iterable.length == 0) {
        return undefined;
    }
    const i = n%iterable.length;
    return i >= 0 ? iterable[i] : iterable[iterable.length + i];
}

export const getFirstTouch = function(touchEvent) {

    const { touches } = touchEvent;

    if(touches && touches[0])
        return touches[0]
    else
        return touchEvent

}

export default {
    clamp,
    getElementAt,
    getFirstTouch,
}