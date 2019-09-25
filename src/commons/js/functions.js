export const clamp = function(number, min, max) {
    return number > max ? max : number < min ? min : number;
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
    getFirstTouch,
}