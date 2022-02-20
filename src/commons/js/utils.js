export const debounce = function (fn, time = 250, immediate = false) {
    let timeout;

    return function (...args) {
        const functionCall = () => fn.apply(this, args);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}

export default {
    debounce,
}