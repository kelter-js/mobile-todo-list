import { useState, useEffect } from "react";
import uuid from "react-native-uuid";

import { tasksService } from "../utils/tasksService";
import { ITask, ViewModes } from "../models";
import useAppState from "./useAppState";
import useInitiateTasks from "./useInitiateTasks";

// i think way more optimized decition is to not update array each method we call
// we should call update array in useEffect, after doneTasks or tasksList has been changed
//we should create separately array operations related fns like sort, delete fragments from array and etc.

const useTasksList = (isViewModeInProgress: boolean, activeTask: string) => {
  const [tasksList, setTasksList] = useState<ITask[]>([]);
  const [doneTasks, setDoneTasks] = useState<ITask[]>([]);

  const createNewTask = (newTaskData: Omit<ITask, "id">) => {
    setTasksList((state) => [...state, { id: uuid.v1(), ...newTaskData }]);
  };

  const { isAppVisible } = useAppState();
  const { isLoadingTasks, updateStorageTasks, getTasks } = useInitiateTasks();

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
    const updatedList = tasksService.getUpdatedListByChangedTask(
      taskData,
      tasksList
    );

    setTasksList(updatedList);

    updateStorageTasks(tasksService.getMergedTasksList(updatedList, doneTasks));
  };

  const removeTask = (viewMode: keyof typeof ViewModes, openedTask: string) => {
    if (viewMode === ViewModes.IN_PROGRESS) {
      const taskToRemove = tasksList.find((item) => item.id === openedTask);

      if (taskToRemove) {
        const { updatedDoneTasks, updatedTasksList } =
          tasksService.getUpdatedListByRemovedTask(
            taskToRemove,
            doneTasks,
            tasksList
          );

        setDoneTasks(updatedDoneTasks);

        setTasksList(updatedTasksList);

        updateStorageTasks(
          tasksService.getMergedTasksList(updatedTasksList, updatedDoneTasks)
        );
      }
    }

    if (viewMode === ViewModes.FINISHED) {
      const taskToRemove = doneTasks.find((item) => item.id === openedTask);

      if (taskToRemove) {
        const { updatedDoneTasks } = tasksService.getUpdatedListByRemovedTask(
          taskToRemove,
          doneTasks
        );

        setDoneTasks(updatedDoneTasks);

        updateStorageTasks(
          tasksService.getMergedTasksList(tasksList, updatedDoneTasks)
        );
      }
    }
  };

  const markTaskAsUndone = (openedTask: string) => {
    const taskToMoveBack = doneTasks.find((item) => item.id === openedTask);

    if (taskToMoveBack) {
      const { updatedDoneTasks, updatedTasksList } =
        tasksService.getUpdatedListsByChangeMark(
          taskToMoveBack,
          tasksList,
          doneTasks
        );

      setTasksList(updatedDoneTasks);
      setDoneTasks(updatedTasksList);

      updateStorageTasks(
        tasksService.getMergedTasksList(updatedTasksList, updatedDoneTasks)
      );
    }
  };

  const clearDoneTasks = () => {
    setDoneTasks([]);

    updateStorageTasks([...tasksList]);
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
    clearDoneTasks,
  };
};

export default useTasksList;
