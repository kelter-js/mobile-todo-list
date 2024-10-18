import { useState, useEffect, useMemo } from "react";
import uuid from "react-native-uuid";

import { tasksService } from "../utils/tasksService";
import { ViewModes } from "../enums";
import { ITask } from "../models";
import useAppState from "./useAppState";
import useInitiateTasks from "./useInitiateTasks";
import { SORT_DIRECTIONS } from "../entities/SortDirections";
import { sortByDates } from "../utils/sortByDates";
import {
  cancelScheduledNotification,
  schedulePushNotification,
} from "../utils/notifications";

//we need to add sort to fns list
const useTasksList = (
  isViewModeInProgress: boolean,
  activeTask: string,
  taskToDelete: string
) => {
  const [tasksList, setTasksList] = useState<ITask[]>([]);
  const [doneTasks, setDoneTasks] = useState<ITask[]>([]);
  const [sortDirection, setDirection] = useState<SORT_DIRECTIONS>(
    SORT_DIRECTIONS.DESC
  );

  const createNewTask = async (newTaskData: Omit<ITask, "id">) => {
    //creating notification
    const { notificationId } = await schedulePushNotification({
      title: newTaskData.title,
      date: newTaskData.triggerDate!,
      text: newTaskData.description,
    });

    if (notificationId) {
      //setting in new task data object notification identificator
      newTaskData.taskIdentificatorId = notificationId;
    }

    setTasksList((state) => [...state, { id: uuid.v1(), ...newTaskData }]);
  };

  const handleChangeSortDirection = () => {
    const newSortDirection =
      sortDirection === SORT_DIRECTIONS.ASC
        ? SORT_DIRECTIONS.DESC
        : SORT_DIRECTIONS.ASC;

    setDirection(newSortDirection);

    setTasksList((state) => sortByDates(state, newSortDirection));
    setDoneTasks((state) => sortByDates(state, newSortDirection));
  };

  const { isAppVisible } = useAppState();
  const { isLoadingTasks, updateStorageTasks, getTasks } = useInitiateTasks();

  useEffect(() => {
    if (isAppVisible) {
      getTasks().then(({ parsedTasksList, repeatableTasksList }) => {
        setTasksList(sortByDates(parsedTasksList, sortDirection));
        setDoneTasks(sortByDates(repeatableTasksList, sortDirection));
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

  const removeTask = async (
    viewMode: keyof typeof ViewModes,
    openedTask: string,
    permanentDeletion?: boolean
  ) => {
    if (permanentDeletion) {
      const taskToRemove = [...doneTasks, ...tasksList].find(
        (item) => item.id === openedTask
      );

      if (taskToRemove) {
        if (taskToRemove.taskIdentificatorId) {
          await cancelScheduledNotification(taskToRemove.taskIdentificatorId);
        }

        const { updatedDoneTasks, updatedTasksList } =
          tasksService.getListWithoutTask({
            taskToRemove,
            doneTasks,
            tasksList,
            isDone: viewMode === ViewModes.FINISHED,
          });

        setDoneTasks(updatedDoneTasks);

        setTasksList(updatedTasksList);

        updateStorageTasks(
          tasksService.getMergedTasksList(updatedTasksList, updatedDoneTasks)
        );
      }

      return;
    }

    if (viewMode === ViewModes.IN_PROGRESS) {
      const taskToRemove = tasksList.find((item) => item.id === openedTask);

      if (taskToRemove) {
        if (taskToRemove.taskIdentificatorId) {
          await cancelScheduledNotification(taskToRemove.taskIdentificatorId);
        }

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
  const [deleteTaskData] = [...tasksList, ...doneTasks].filter(
    (task) => task.id === taskToDelete
  );

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
    deleteTaskData,
    clearDoneTasks,
    sortDirection,
    handleChangeSortDirection,
  };
};

export default useTasksList;
