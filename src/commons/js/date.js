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
export const weekdaysFormats = [
    'long',
    'short',
    'narrow'
];
export default {
    daysInMonth,
    getFirstDayOfTheMonth,
    getLastDayOfTheMonth,
    weekdaysFormats
}