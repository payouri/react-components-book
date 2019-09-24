/**
 * 
 * @param {Number} month from 0 to 11
 * @param {Number} year from 1970 YYYY format
*/
export const daysInMonth = function (month, year) {
    return new Date(year, month + 1, 0).getDate();
}
/**
 * 
 * @param {Number} month from 0 to 11
 * @param {Number} year from 1970 YYYY format
*/
export const getLastDayOfTheMonth = function(month, year) {
    return new Date(year, month, daysInMonth(month, year));
}
/**
 * 
 * @param {Number} month from 0 to 11
 * @param {Number} year from 1970 YYYY format
*/
export const getFirstDayOfTheMonth = function(month, year) {
    return new Date(year, month, 1);
}
export const daysFormats = [
    'numeric',
    '2-digit',
];
export const weekdaysFormats = [
    'long',
    'short',
    'narrow'
];
export const monthsFormats = [
    'numeric',
    '2-digit',
    'long',
    'short',
    'narrow',
];
export const yearFormats = [
    'numeric',
    '2-digit',
];
export default {
    daysInMonth,
    getFirstDayOfTheMonth,
    getLastDayOfTheMonth,
    monthsFormats,
    weekdaysFormats,
    yearFormats,
}