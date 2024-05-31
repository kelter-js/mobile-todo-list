import { useState } from "react";
import uuid from "react-native-uuid";

import { ITask, ViewModes } from "../models";

//here we should place logic to fetch tasks from BE if user logged in, or get them from local state

//test array
const INITIAL_TASKS = [
  {
    id: uuid.v1(),
    description: "blah-blah",
    title: "first task",
    isRepeatable: false,
    triggerDate: new Date("Sat Jun 13 2024 00:05:29 GMT+0500"),
  },
  {
    id: uuid.v1(),
    description: "bleh-bleh",
    title: "second task",
    isRepeatable: false,
    triggerDate: new Date("Sat Sep 13 2024 00:05:29 GMT+0500"),
  },
  {
    id: uuid.v1(),
    description: "bluh-bluh",
    title: "third task",
    isRepeatable: false,
    triggerDate: new Date("Sat Jan 13 2025 00:05:29 GMT+0500"),
  },
];

const useTasksList = (isViewModeInProgress: boolean, activeTask: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasksList, setTasksList] = useState<ITask[]>(INITIAL_TASKS);
  const [doneTasks, setDoneTasks] = useState<ITask[]>([]);

  const createNewTask = (newTaskData: Omit<ITask, "id">) => {
    setTasksList((state) => [...state, { id: uuid.v1(), ...newTaskData }]);
  };

  const updateTask = (taskData: ITask) => {
    const [taskToChange] = tasksList.filter((task) => task.id === taskData.id);
    const taskIndex = tasksList.indexOf(taskToChange);

    console.log(taskIndex);

    setTasksList((state) => [
      ...state.slice(0, taskIndex),
      { ...taskData },
      ...state.slice(taskIndex + 1),
    ]);
  };

  const removeTask = (viewMode: keyof typeof ViewModes, openedTask: string) => {
    if (viewMode === ViewModes.IN_PROGRESS) {
      const taskToRemove = tasksList.find((item) => item.id === openedTask);

      if (taskToRemove) {
        const taskIndex = tasksList.indexOf(taskToRemove);

        setDoneTasks((state) => [...state, taskToRemove]);

        setTasksList([
          ...tasksList.slice(0, taskIndex),
          ...tasksList.slice(taskIndex + 1),
        ]);
      }
    }

    if (viewMode === ViewModes.FINISHED) {
      const taskToRemove = doneTasks.find((item) => item.id === openedTask);

      if (taskToRemove) {
        const taskIndex = doneTasks.indexOf(taskToRemove);

        setDoneTasks((state) => [
          ...state.slice(0, taskIndex),
          ...state.slice(taskIndex + 1),
        ]);
      }
    }
  };

  const markTaskAsUndone = (openedTask: string) => {
    const taskToMoveBack = doneTasks.find((item) => item.id === openedTask);

    if (taskToMoveBack) {
      const taskIndex = doneTasks.indexOf(taskToMoveBack);

      setTasksList((state) => [...state, taskToMoveBack]);

      setDoneTasks((state) => [
        ...state.slice(0, taskIndex),
        ...state.slice(taskIndex + 1),
      ]);
    }
  };

  const [activeTaskData] = tasksList.filter((task) => task.id === activeTask);

  return {
    doneTasks,
    isLoading,
    tasksList,
    createNewTask,
    updateTask,
    removeTask,
    markTaskAsUndone,
    tasksToView: isViewModeInProgress ? tasksList : doneTasks,
    activeTaskData,
  };
};

export default useTasksList;
