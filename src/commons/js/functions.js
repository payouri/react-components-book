export const clamp = function(number, min, max) {
    return number > max ? max : number < min ? min : number;
}

export default {
    clamp,
}