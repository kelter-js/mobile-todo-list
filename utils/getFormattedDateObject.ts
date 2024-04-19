import getMonthName from "./getMonthName";
import { YEAR_SEASONS } from "../models";

const getSeason = (monthIndex: number): keyof typeof YEAR_SEASONS => {
  switch (true) {
    case monthIndex <= 2:
      return YEAR_SEASONS.WINTER;
    case monthIndex >= 3 && monthIndex <= 5:
      return YEAR_SEASONS.SPRING;
    case monthIndex >= 6 && monthIndex <= 8:
      return YEAR_SEASONS.SUMMER;
    case monthIndex >= 9 && monthIndex <= 11:
      return YEAR_SEASONS.AUTUMN;
    default:
      return YEAR_SEASONS.WINTER;
  }
};

const getFormattedDateObject = (date: Date) => ({
  year: date.getFullYear(),
  month: getMonthName(date),
  monthDate: date.getDate(),
  hour: (date.getHours() < 10 ? "0" : "") + date.getHours(),
  minutes: (date.getMinutes() < 10 ? "0" : "") + date.getMinutes(),
  season: getSeason(date.getMonth()),
});

export default getFormattedDateObject;
