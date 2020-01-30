import formatDate from '../formatDate';

const SEC_IN_MIN = 60;
const SEC_IN_HOUR = SEC_IN_MIN * 60;
const SEC_IN_DAY = SEC_IN_HOUR * 24;
const SEC_IN_WEEK = SEC_IN_DAY * 7;

/**
 *
 * @param {number} secs
 * @returns {Date}
 */
const plusSecs = secs => new Date(Date.now() + secs * 1000);

const dateDurations = [
  // 1 sec negative
  {
    from: plusSecs(-1),
    to: '00:00:00',
  },
  // 1 minute negative
  {
    from: plusSecs(SEC_IN_MIN * -1),
    to: '00:01:00',
  },
  // 1 hour negative
  {
    from: plusSecs(SEC_IN_HOUR * -1),
    to: '00:00:00',
  },
  // 1 day negative
  {
    from: plusSecs(SEC_IN_DAY * -1),
    to: '00:00:00',
  },
  // 1 week negative
  {
    from: plusSecs(SEC_IN_WEEK * -1),
    to: '00:00:00',
  },

  // 1 sec
  {
    from: plusSecs(1),
    to: '00:00:01',
  },
  // 1 minute
  {
    from: plusSecs(SEC_IN_MIN),
    to: '00:01:00',
  },
  // 1 and a half minute
  {
    from: plusSecs(SEC_IN_MIN * 1.5),
    to: '00:01:30',
  },
  // 10 minutes
  {
    from: plusSecs(SEC_IN_MIN * 10),
    to: '00:10:00',
  },
  // 1 hour
  {
    from: plusSecs(SEC_IN_HOUR * 1),
    to: '01:00:00',
  },
  // 10 hours
  {
    from: plusSecs(SEC_IN_HOUR * 10),
    to: '10:00:00',
  },
  // 1 day
  {
    from: plusSecs(SEC_IN_DAY * 1),
    to: '24:00:00',
  },
  // 1 day and 1Sec
  {
    from: plusSecs(SEC_IN_DAY * 1 + 1),
    to: '1 dia',
  },
  // 1 day and 59 minute and 59 seconds
  {
    from: plusSecs(SEC_IN_DAY * 1 + 1),
    to: '1 dia',
  },
  // 1 day and 1 hour
  {
    from: plusSecs(SEC_IN_DAY * 1 + SEC_IN_HOUR * 1),
    to: '1 dia e 1 hora',
  },
  // 1 day and 2 hours
  {
    from: plusSecs(SEC_IN_DAY * 1 + SEC_IN_HOUR * 2),
    to: '1 dia e 2 horas',
  },
  // 6 days, 23 hour, 59 minutes and 59 seconds
  {
    from: plusSecs(SEC_IN_DAY * 7 - 1),
    to: '6 dias e 23 horas',
  },
  // 1 week
  {
    from: plusSecs(SEC_IN_WEEK * 1),
    to: '1 semana',
  },
  // 1 week and 1 day
  {
    from: plusSecs(SEC_IN_WEEK * 1 + SEC_IN_DAY * 1),
    to: '1 semana e 1 dia',
  },
  // 1 week and 3 days
  {
    from: plusSecs(SEC_IN_WEEK * 1 + SEC_IN_DAY * 3),
    to: '1 semana e 3 dias',
  },
  // 15 days
  {
    from: plusSecs(SEC_IN_WEEK * 2 + SEC_IN_DAY * 1),
    to: '2 semanas e 1 dia',
  },
  // 15 weeks
  {
    from: plusSecs(SEC_IN_WEEK * 15),
    to: '15 semanas',
  },
];

dateDurations.forEach(({ from, to }) => {
  it(`formats ${from
    .getTime()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}ms as "${to}"`, () => {
    const fromString = formatDate(from);

    expect(fromString).toBe(to);
  });
});
