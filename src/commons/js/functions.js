export const clamp = function(number, min, max) {
    return number > max ? max : number < min ? min : number;
}

export const firstTouchNormalize = function(touchEvent) {

    console.log(touchEvent.touches && touchEvent.touches[0]);

}

export default {
    clamp,
}