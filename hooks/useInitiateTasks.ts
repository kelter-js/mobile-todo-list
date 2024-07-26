import { Alert } from "react-native";
import { useState } from "react";

import { ACTIONS, ITask } from "../models";
import storageManager from "../utils/storageManager";
import validateTasksList from "../utils/validateTasksList";
import { useLoadContext } from "../context/LoadContext";
import fakePromiseTimer from "../utils/fakePromiseTimer";

// heres template for future logic

// AsyncStorage.getItem("taskTime").then(async (value) => {
//   if (value !== null) {
//     const currentDate = new Date();
//     const taskDate = new Date(value);

//     if (!(taskDate > currentDate)) {
//       await AsyncStorage.removeItem("taskTime");
//       await AsyncStorage.removeItem("notificationId");
//     }
//   } else {
//     await AsyncStorage.removeItem("notificationId");
//   }
// });

//this hook should be with context, all app should be wrapped in this context
const useInitiateTasks = () => {
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const { setAction } = useLoadContext();
  //we should set state, which determines text - Loading or Updating for splashscreen component
  //if we update - this state should receive text 'Updating'
  //if we load tasks list - this state should receive text 'Loading'
  //create enum or type for state typization

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
    //here we should map through tasks, check all tasks if they are actual with help of isTaskExpired
    //then we check initial  tasks length and parsed tasks length, if they arent the same
    //we immediately update storageManager tasks with parsed list, while also returning parsed list
    //our validation tasks list function should return object - overall count of parsed tasks, done tasks, and just tasks
    //count - to check if initial tasks and parsed tasks length mismatch, done tasks(if they are expired and task is repeatble) and just tasks to set two separate states
    //in consumer hook
    const { count, repeatableTasksList, parsedTasksList } =
      validateTasksList(tasks);

    if (count !== tasks.length) {
      setAction(ACTIONS.UPDATING);
      await updateTasks([...repeatableTasksList, ...parsedTasksList]);
      //set action form ENUM of actions, which should be created
      //setAction()
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
