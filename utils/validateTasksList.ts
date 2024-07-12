import isTaskExpired from "./isTaskExpired";
import { ITask } from "../models";

const validateTasksList = (incomingTasks: ITask[]) => {
  const parsedTasksList: ITask[] = [];
  const repeatableTasksList: ITask[] = [];

  incomingTasks.forEach((currentTask) => {
    const isExpired = isTaskExpired(currentTask.triggerDate!);

    if (isExpired && currentTask.isRepeatable) {
      repeatableTasksList.push(currentTask);
      return;
    }

    if (isExpired) {
      return;
    }

    parsedTasksList.push(currentTask);
  });

  return {
    count: parsedTasksList.length + repeatableTasksList.length,
    parsedTasksList,
    repeatableTasksList,
  };
};

export default validateTasksList;
