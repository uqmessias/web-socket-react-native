// @ts-check
/**
 *
 * @param {number} value
 * @returns {number}
 */
function roundDown(value) {
  return value > 0 ? Math.floor(value) : Math.ceil(value);
}

/**
 *
 * @param {Date} dateLeft
 * @param {Date} dateRight
 * @returns {{weeks: number, days: number, hours: number, minutes: number, seconds: number}}
 */
function differenceInDuration(dateLeft, dateRight) {
  const diffSeconds = roundDown(
    (dateLeft.getTime() - dateRight.getTime()) / 1000,
  );
  const seconds = diffSeconds % 60;
  const diffMinutes = roundDown((diffSeconds - seconds) / 60);
  const minutes = diffMinutes % 60;
  const diffHours = roundDown((diffMinutes - minutes) / 60);
  const hours = diffHours % 24;
  const diffDays = roundDown((diffHours - hours) / 24);
  const days = diffDays % 7;
  const weeks = roundDown((diffDays - days) / 7);

  return {
    weeks,
    days,
    hours,
    minutes,
    seconds,
  };
};

/**
 *
 * @param {number} value
 * @param {string} singular
 * @returns {string}
 */
const pluralize = (value, singular) =>
  value > 0 ? `${value} ${singular}${value > 1 ? 's' : ''}` : '';

/**
 *
 * @param {number} value
 * @returns {string}
 */
const twoDigits = value =>
  value <= 9 ? `0${value.toFixed(0)}` : value.toFixed(0);

/**
 *
 * @param {Date} date
 * @returns {string}
 */
export default date => {
  const now = new Date();
  const { weeks, days, hours, minutes, seconds } = differenceInDuration(
    date,
    now,
  );

  if (weeks < 0 || days < 0 || hours < 0 || minutes < 0 || seconds < 0) {
    return '00:00:00';
  }

  // 1 semana e 2 dias
  if (weeks > 0) {
    const andDays = days > 0 ? ` e ${pluralize(days, 'dia')}` : '';
    return `${pluralize(weeks, 'semana')}${andDays}`;
  }

  // 2 dias e 5 horas
  if (days > 1 || (days === 1 && (hours > 0 || minutes > 0 || seconds > 0))) {
    const andHours = hours > 0 ? ` e ${pluralize(hours, 'hora')}` : '';
    return `${pluralize(days, 'dia')}${andHours}`;
  }

  // 23:45:12
  const definitiveHours = days === 1 ? 24 : hours;
  return `${twoDigits(definitiveHours)}:${twoDigits(minutes)}:${twoDigits(
    seconds,
  )}`;
};
