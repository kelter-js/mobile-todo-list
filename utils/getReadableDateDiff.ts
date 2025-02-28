import { getNoun } from "./getNoun";

const ONE_SECOND = 1000;
const MINUTE = 60;
const HOUR = 60;
const DAY = 24;

export const getReadableDateDiff = (startDate?: Date, endDate?: Date) => {
  if (!startDate || !endDate) return "";

  const diffBetweenDates = endDate.getTime() - startDate.getTime();

  const diffInSeconds = Math.floor(diffBetweenDates / ONE_SECOND);
  const diffInMinutes = Math.floor(diffInSeconds / MINUTE);
  const diffInHours = Math.floor(diffInMinutes / HOUR);
  const diffInDays = Math.floor(diffInHours / DAY);

  if (diffInDays > 0) {
    return `Осталось ${diffInDays} ${getNoun(diffInDays, [
      "день",
      "дня",
      "дней",
    ])}`;
  }

  if (diffInHours > 0) {
    return `Осталось ${diffInHours} ${getNoun(diffInHours, [
      "час",
      "часа",
      "часов",
    ])}`;
  }

  if (diffInMinutes > 0) {
    return `Осталось ${diffInMinutes} ${getNoun(diffInMinutes, [
      "минута",
      "минуты",
      "минут",
    ])}`;
  }

  if (diffInSeconds > 0) {
    return `Осталось ${diffInSeconds} ${getNoun(diffInSeconds, [
      "секунда",
      "секунды",
      "секунд",
    ])}`;
  }
};
