export enum SCHEDULE_TYPES {
  MINUTES = "минут",
  HOURS = "часов",
  DAYS = "дней",
  WEEKS = "недель",
}

const MILLISECONDS_IN_MINUTE = 60 * 1000; // 1 минута = 60 000 мс
const MILLISECONDS_IN_HOUR = 60 * MILLISECONDS_IN_MINUTE; // 1 час = 3 600 000 мс
const MILLISECONDS_IN_DAY = 24 * MILLISECONDS_IN_HOUR; // 1 день = 86 400 000 мс
const MILLISECONDS_IN_WEEK = 7 * MILLISECONDS_IN_DAY; // 1 неделя = 604 800 000 мс

const MILLISECONDS_RANGES = [
  MILLISECONDS_IN_MINUTE,
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_WEEK,
];

export const generateNextTimer = (
  scheduleType: SCHEDULE_TYPES,
  scheduleFrequency: number
) => {
  const currentMilliseconds =
    MILLISECONDS_RANGES[INTERVAL_TYPES.indexOf(scheduleType)];

  return new Date(Date.now() + currentMilliseconds * scheduleFrequency);
};

export const INTERVAL_TYPES = [
  SCHEDULE_TYPES.MINUTES,
  SCHEDULE_TYPES.HOURS,
  SCHEDULE_TYPES.DAYS,
  SCHEDULE_TYPES.WEEKS,
];

export enum MIN_SCHEDULE_INTERVAL {
  "минут" = 5,
  "часов" = 1,
  "дней" = 1,
  "недель" = 1,
}

export const INTERVAL_TYPE_RANGES = [
  new Array(50)
    .fill(null)
    .map((_, index) => (index < 4 ? null : index + 1))
    .filter(Boolean),
  new Array(12).fill(null).map((_, index) => index + 1),
  new Array(6).fill(null).map((_, index) => index + 1),
  new Array(3).fill(null).map((_, index) => index + 1),
];
