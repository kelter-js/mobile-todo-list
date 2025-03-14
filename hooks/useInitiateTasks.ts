import { Alert } from "react-native";
import { useState } from "react";

import { useLoadContext } from "../context/LoadContext";
import { ACTIONS } from "../enums";
import { TaskData } from "../models";
import validateTasksList from "../utils/validateTasksList";
import storageManager from "../utils/storageManager";
import { schedulePushNotification } from "../utils/notifications";
import { generateNextTimer } from "../components/ScheduleSelection/constants";

export const reScheduleTasks = async (
  tasksList: TaskData[],
  setTasks?: (tasks: TaskData[]) => void,
  allTasks?: TaskData[]
) => {
  for (const task of tasksList) {
    const nextNotificationDate = generateNextTimer(
      task.repeatType!,
      task.repeatFrequency!
    );

    const { notificationId } = await schedulePushNotification({
      text: task.description,
      title: task.title,
      date: nextNotificationDate,
    });

    task.taskIdentificatorId = String(notificationId);
    task.triggerDate = nextNotificationDate;
  }

  if (setTasks && allTasks) {
    const newTasksList = [...tasksList];
    allTasks.forEach((task) => {
      if (
        !newTasksList.some(
          (subTask) => subTask.taskIdentificatorId === task.taskIdentificatorId
        )
      ) {
        newTasksList.push(task);
      }
    });

    setTasks(newTasksList);
  }
};

const useInitiateTasks = () => {
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const { setAction } = useLoadContext();

  const updateTasks = async (updatedTasks: TaskData[]) => {
    setIsLoadingTasks(true);
    setAction(ACTIONS.UPDATING);

    storageManager
      .updateTasksList(updatedTasks)
      .catch(() => Alert.alert("Updating tasks to storage failed."))
      .finally(() => setIsLoadingTasks(false));
  };

  const getTasks = async () => {
    setAction(ACTIONS.LOADING);
    setIsLoadingTasks(true);
    const tasks = await storageManager.getTasksList();
    setIsLoadingTasks(false);

    const { count, repeatableTasksList, parsedTasksList, replanableTasksList } =
      validateTasksList(tasks);

    if (replanableTasksList.length) {
      //создаём новое напоминание, обновляем дату в таске и обновляем id напоминания в таске
      //после этого нужно засунуть эти таски в список repeatableTasksList
      const localTaskList = [...replanableTasksList];
      await reScheduleTasks(localTaskList);
      await updateTasks([
        ...new Set([
          ...repeatableTasksList,
          ...parsedTasksList,
          ...localTaskList,
        ]),
      ]);

      return { repeatableTasksList, parsedTasksList };
    }

    if (count !== tasks.length) {
      await updateTasks([...repeatableTasksList, ...parsedTasksList]);
    }

    return { repeatableTasksList, parsedTasksList };
  };

  return {
    isLoadingTasks,
    updateStorageTasks: updateTasks,
    getTasks,
  };
};

export default useInitiateTasks;
