import { Alert } from "react-native";
import { useState } from "react";

import { useLoadContext } from "../context/LoadContext";
import { ACTIONS } from "../enums";
import { ITask } from "../models";
import validateTasksList from "../utils/validateTasksList";
import storageManager from "../utils/storageManager";

const useInitiateTasks = () => {
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const { setAction } = useLoadContext();

  const updateTasks = async (updatedTasks: ITask[]) => {
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

    const { count, repeatableTasksList, parsedTasksList } =
      validateTasksList(tasks);

    if (count !== tasks.length) {
      setAction(ACTIONS.UPDATING);
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
