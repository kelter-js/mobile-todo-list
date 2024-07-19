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
  const { isLoadingTasks, updateStorageTasks, getTasks } = useInitiateTasks();

  useEffect(() => {
    setTimeout(() => {
      getTasks().then((res) => console.log("fetched from state tasks:", res));
    }, 1000);
  });

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

    const updatedList = [
      ...tasksList.slice(0, taskIndex),
      { ...taskData },
      ...tasksList.slice(taskIndex + 1),
    ];

    setTasksList(updatedList);

    updateStorageTasks([...updatedList, ...doneTasks]);
  };

  const removeTask = (viewMode: keyof typeof ViewModes, openedTask: string) => {
    if (viewMode === ViewModes.IN_PROGRESS) {
      const taskToRemove = tasksList.find((item) => item.id === openedTask);

      if (taskToRemove) {
        const taskIndex = tasksList.indexOf(taskToRemove);

        const updatedDoneTasks = [...doneTasks, taskToRemove];
        setDoneTasks(updatedDoneTasks);

        const updatedTasksList = [
          ...tasksList.slice(0, taskIndex),
          ...tasksList.slice(taskIndex + 1),
        ];

        setTasksList(updatedTasksList);

        updateStorageTasks([...updatedTasksList, ...updatedDoneTasks]);
      }
    }

    if (viewMode === ViewModes.FINISHED) {
      const taskToRemove = doneTasks.find((item) => item.id === openedTask);

      if (taskToRemove) {
        const taskIndex = doneTasks.indexOf(taskToRemove);

        const updatedDoneTasks = [
          ...doneTasks.slice(0, taskIndex),
          ...doneTasks.slice(taskIndex + 1),
        ];

        setDoneTasks(updatedDoneTasks);

        updateStorageTasks([...tasksList, ...updatedDoneTasks]);
      }
    }
  };

  const markTaskAsUndone = (openedTask: string) => {
    const taskToMoveBack = doneTasks.find((item) => item.id === openedTask);

    if (taskToMoveBack) {
      const taskIndex = doneTasks.indexOf(taskToMoveBack);

      const updatedDoneTasks = [...doneTasks, taskToMoveBack];
      setTasksList(updatedDoneTasks);

      const updatedTasksList = [
        ...tasksList.slice(0, taskIndex),
        ...tasksList.slice(taskIndex + 1),
      ];
      setDoneTasks(updatedTasksList);

      updateStorageTasks([...updatedTasksList, ...updatedDoneTasks]);
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
