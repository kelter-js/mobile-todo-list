import { useState, useEffect } from "react";
import uuid from "react-native-uuid";

import { tasksService } from "../utils/tasksService";
import { ViewModes } from "../enums";
import { ITask } from "../models";
import useAppState from "./useAppState";
import useInitiateTasks from "./useInitiateTasks";

//we need to add sort to fns list
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
