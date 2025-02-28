import { ITask } from "../models";

export const tasksService = {
  getMergedTasksList(firstTasksArray: ITask[], secondTasksArray: ITask[]) {
    return [...firstTasksArray, ...secondTasksArray];
  },

  getUpdatedListByChangedTask(newTaskData: ITask, tasksList: ITask[]) {
    const [taskToChange] = tasksList.filter(
      (task) => task.id === newTaskData.id
    );
    const taskIndex = tasksList.indexOf(taskToChange);

    return [
      ...tasksList.slice(0, taskIndex),
      { ...newTaskData },
      ...tasksList.slice(taskIndex + 1),
    ];
  },

  getUpdatedListsByChangeMark(
    changedTask: ITask,
    tasksList: ITask[],
    doneTasks: ITask[]
  ) {
    const updatedDoneTasks = doneTasks.filter(
      (task) => task.id !== changedTask.id
    );

    const updatedTasksList = [...tasksList, changedTask];

    return {
      updatedDoneTasks,
      updatedTasksList,
    };
  },

  getUpdatedListByRemovedTask(
    removedTask: ITask,
    doneTasks: ITask[],
    tasksList?: ITask[]
  ) {
    if (tasksList) {
      const taskIndex = tasksList.indexOf(removedTask);

      const updatedDoneTasks = [...doneTasks, removedTask];

      const updatedTasksList = [
        ...tasksList.slice(0, taskIndex),
        ...tasksList.slice(taskIndex + 1),
      ];

      return {
        updatedDoneTasks,
        updatedTasksList,
      };
    } else {
      const taskIndex = doneTasks.indexOf(removedTask);

      const updatedDoneTasks = [
        ...doneTasks.slice(0, taskIndex),
        ...doneTasks.slice(taskIndex + 1),
      ];

      return {
        updatedDoneTasks,
        updatedTasksList: [],
      };
    }
  },

  getListWithoutTask({
    taskToRemove,
    doneTasks,
    tasksList,
    isDone,
  }: {
    taskToRemove: ITask;
    doneTasks: ITask[];
    tasksList: ITask[];
    isDone: boolean;
  }) {
    const operationList = isDone ? doneTasks : tasksList;
    const taskIndex = operationList.indexOf(taskToRemove);

    operationList.splice(taskIndex, 1);

    return {
      updatedDoneTasks: doneTasks,
      updatedTasksList: tasksList,
    };
  },
};
