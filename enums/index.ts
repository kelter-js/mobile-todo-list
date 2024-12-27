export enum ViewModes {
  FINISHED = "FINISHED",
  IN_PROGRESS = "IN_PROGRESS",
}

export enum YEAR_SEASONS {
  WINTER = "WINTER",
  SPRING = "SPRING",
  SUMMER = "SUMMER",
  AUTUMN = "AUTUMN",
}

export enum ACTIONS {
  UPDATING = "Updating",
  LOADING = "Loading",
}

export enum SCHEDULE_TYPES {
  MONTH = "MONTH",
  WEEK = "WEEK",
  DAY = "DAY",
  HOUR = "HOUR",
  MINUTES = "MINUTES",
}

export const SCHEDULE_TYPE_VALUES = {
  [SCHEDULE_TYPES.MONTH]: [1, 2, 3],
  [SCHEDULE_TYPES.WEEK]: [1, 2, 3],
  [SCHEDULE_TYPES.DAY]: [1, 2, 3, 4, 5, 6],
  [SCHEDULE_TYPES.HOUR]: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23,
  ],
  [SCHEDULE_TYPES.MINUTES]: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60,
  ],
};
