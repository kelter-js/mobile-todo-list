import { useState, useEffect } from "react";
import uuid from "react-native-uuid";

import { ITask, ViewModes } from "../models";
import useAppState from "./useAppState";
import useInitiateTasks from "./useInitiateTasks";

const useTasksList = (isViewModeInProgress: boolean, activeTask: string) => {
  const [tasksList, setTasksList] = useState<ITask[]>([]);
  const [doneTasks, setDoneTasks] = useState<ITask[]>([]);

  const createNewTask = (newTaskData: Omit<ITask, "id">) => {
    setTasksList((state) => [...state, { id: uuid.v1(), ...newTaskData }]);
  };

  const { isAppVisible } = useAppState();
  const { isLoadingTasks, updateTasks, getTasks } = useInitiateTasks();

  useEffect(() => {
    if (isAppVisible) {
      //here we need to set two separate states - tasks and doneTasks
      getTasks().then(({ parsedTasksList, repeatableTasksList }) => {
        setTasksList(parsedTasksList);
        setDoneTasks(repeatableTasksList);
      });
    }
  }, [isAppVisible]);

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
    isLoadingTasks,
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
