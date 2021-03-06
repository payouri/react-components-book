export const clamp = function (number: number, min: number, max: number) {
  return number > max ? max : number < min ? min : number;
};

export const generateUniqKey = () => {
  return new Date().getTime().toString(16);
};

export const getElementAt = function (iterable: any[], n: number) {
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
