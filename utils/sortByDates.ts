import { SORT_DIRECTIONS } from "../entities/SortDirections";
import { ITask } from "../models";

const IS_EQUAL = 0;

export const sortByDates = (tasks: ITask[], direction: SORT_DIRECTIONS) =>
  [...tasks].sort((a, b) => {
    const firstTask = direction === SORT_DIRECTIONS.ASC ? b : a;
    const secondTask = direction === SORT_DIRECTIONS.ASC ? a : b;

    if (firstTask.triggerDate && secondTask.triggerDate) {
      return firstTask.triggerDate.getTime() - secondTask.triggerDate.getTime();
    }

    return IS_EQUAL;
  });
