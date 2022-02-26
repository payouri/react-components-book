export const clamp = function (number: number, min: number, max: number) {
  return number > max ? max : number < min ? min : number;
};

export const generateUniqKey = () => {
  return `${new Date().getTime().toString(16)}_${Math.random()}`;
};

export const getMatchingIndex = function <T>(iterable: T[], n: number): number {
  if (iterable.length == 0) {
    return -1;
  }

  const newIndex = n % iterable.length;

  return newIndex < 0 ? iterable.length - 1 : newIndex;
};

export const getElementAt = function <T>(
  iterable: T[],
  n: number
): T | undefined {
  if (iterable.length == 0) {
    return undefined;
  }
  const i = n % iterable.length;
  return i >= 0 ? iterable[i] : iterable[iterable.length + i];
};

export const getFirstTouch = function (touchEvent: React.TouchEvent) {
  const { touches } = touchEvent;

  if (touches && touches[0]) return touches[0];
  else return touchEvent;
};

export default {
  clamp,
  generateUniqKey,
  getElementAt,
  getFirstTouch,
};
