import { SORT_DIRECTIONS } from "../entities/SortDirections";
import { ITask } from "../models";

export const sortByDates = (tasks: ITask[], direction: SORT_DIRECTIONS) =>
  [...tasks].sort(
    (a, b) =>
      (direction === SORT_DIRECTIONS.ASC ? b : a)?.triggerDate.getTime() -
      (direction === SORT_DIRECTIONS.ASC ? a : b)?.triggerDate.getTime()
  );
