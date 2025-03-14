import {
  createContext,
  ReactNode,
  FC,
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { ViewModes } from "../enums";
import useNotificationRegister from "../hooks/useNotificationRegister";
import useViewMode from "../hooks/useViewMode";
import useManageTask from "../hooks/useManageTask";
import useTasksList from "../hooks/useTasksList";
import { reScheduleTasks } from "../hooks/useInitiateTasks";
import {
  cancelScheduledNotification,
  schedulePushNotification,
} from "../utils/notifications";
import { TaskData } from "../models";
import { Keyboard } from "react-native";
import { SORT_DIRECTIONS } from "../entities/SortDirections";

interface StateContextProps {
  isLoadingTasks: boolean;
  isTaskFormOpened: boolean;
  isModalWindowOpened: boolean;
  isTaskEditMode: boolean;
  isViewModeInProgress: boolean;
  activeTaskData: TaskData;
  tasksToView: TaskData[];
  deleteTaskData: TaskData;
  handleCloseTaskModal: VoidFunction;
  handleMoveTaskBack: VoidFunction;
  toggleTaskForm: VoidFunction;
  handleCloseDeletionModal: VoidFunction;
  clearDoneTasks: VoidFunction;
  handleChangeSortDirection: VoidFunction;
  handleTaskCreation: (data: Omit<TaskData, "id">) => void;
  handleTaskOpen: (id: string) => void;
  handleTaskConfigure: (id: string) => void;
  handleDeleteTask: (id: string) => void;
  handleRemoveTask: (id: string, isPermanentDeletion?: boolean) => void;
  deleteTask: string;
  activeTask: string;
  setViewMode: Dispatch<SetStateAction<keyof typeof ViewModes>>;
  sortDirection: SORT_DIRECTIONS;
  createNewNotification: (remindDate: Date, task: TaskData) => void;
}

const StateContext = createContext<StateContextProps>({} as StateContextProps);

interface StateContextProviderProps {
  children: ReactNode;
}

const StateContextProvider: FC<StateContextProviderProps> = ({ children }) => {
  const { notifications, setNotifications } = useNotificationRegister();

  const { viewMode, setViewMode, isViewModeInProgress } = useViewMode();

  const {
    isModalWindowOpened,
    isTaskEditMode,
    activeTask,
    setModalOpened,
    setTaskEditMode,
    setActiveTask,
    deleteTask,
    setDeleteTask,
  } = useManageTask();

  const {
    isLoadingTasks,
    createNewTask,
    updateTask,
    doneTasks,
    tasksList,
    removeTask,
    markTaskAsUndone,
    tasksToView,
    activeTaskData,
    deleteTaskData,
    clearDoneTasks,
    sortDirection,
    handleChangeSortDirection,
    setTasksList,
  } = useTasksList(isViewModeInProgress, activeTask, deleteTask);

  // reschedule tasks
  useEffect(() => {
    if (notifications.length !== 0) {
      const notificationsIds = notifications.map(
        (notification) => notification.request.identifier
      );
      const tasksToReplan = [...doneTasks, ...tasksList].filter(
        (task) =>
          task.isAutoPlanning &&
          task.taskIdentificatorId &&
          notificationsIds.includes(task.taskIdentificatorId)
      );

      reScheduleTasks(tasksToReplan, setTasksList, tasksList);
      setNotifications([]);
    }
  }, [notifications]);

  const [isTaskFormOpened, setTaskFormOpened] = useState(false);

  const toggleTaskForm = useCallback(() => {
    setTaskFormOpened((state) => !state);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpened(false);
    setActiveTask("");
    setDeleteTask("");
  }, []);

  const handleCloseDeletionModal = useCallback(() => {
    setModalOpened(false);
    setDeleteTask("");
  }, []);

  const handleCloseTaskModal = useCallback(() => {
    handleCloseModal();
    setTaskEditMode(false);
    setTaskFormOpened(false);
  }, []);

  const handleTaskCreation = useCallback(
    (data: Omit<TaskData, "id"> | TaskData) => {
      if (isTaskEditMode) {
        Keyboard.dismiss();

        updateTask(data);

        handleCloseTaskModal();
      } else {
        handleCreateNewTask(data);
        setTaskFormOpened(false);
      }
    },
    [isTaskEditMode, handleCloseTaskModal]
  );

  const handleTaskOpen = useCallback((id: string) => setActiveTask(id), []);

  const handleDeleteTask = useCallback((id: string) => {
    setDeleteTask(id);
    setModalOpened(true);
  }, []);

  const handleTaskConfigure = useCallback((id: string) => {
    setTaskEditMode(true);
    setActiveTask(id);
  }, []);

  const handleCreateNewTask = (taskData: Omit<TaskData, "id">) => {
    Keyboard.dismiss();
    createNewTask(taskData);
    handleCloseTaskModal();
  };

  useEffect(() => {
    if (Boolean(activeTask.trim())) {
      setModalOpened(true);
    }
  }, [activeTask]);

  const createNewNotification = async (remindDate: Date, task: TaskData) => {
    const taskData = { ...task };

    if (taskData.taskIdentificatorId) {
      await cancelScheduledNotification(taskData.taskIdentificatorId);
    }

    const { notificationId } = await schedulePushNotification({
      title: activeTask,
      date: remindDate,
      text: activeTask,
    });

    if (notificationId) {
      taskData.taskIdentificatorId = notificationId;
    }

    taskData.createdAt = new Date();

    updateTask(taskData);

    handleCloseModal();
  };

  const handleRemoveTask = useCallback(
    (id: string, isPermanentDeletion?: boolean) => {
      removeTask(viewMode, id, isPermanentDeletion);

      handleCloseModal();
    },
    [viewMode, removeTask]
  );

  const handleMoveTaskBack = useCallback(() => {
    markTaskAsUndone(activeTask);

    handleCloseModal();
  }, [activeTask]);

  const memoizedValue = useMemo(
    () => ({
      isLoadingTasks,
      toggleTaskForm,
      isTaskFormOpened,
      handleCloseTaskModal,
      handleTaskCreation,
      isModalWindowOpened,
      isTaskEditMode,
      activeTaskData,
      setViewMode,
      isViewModeInProgress,
      sortDirection,
      tasksToView,
      handleChangeSortDirection,
      handleTaskOpen,
      handleTaskConfigure,
      handleDeleteTask,
      deleteTask,
      activeTask,
      handleRemoveTask,
      createNewNotification,
      handleMoveTaskBack,
      handleCloseDeletionModal,
      deleteTaskData,
      clearDoneTasks,
    }),
    [
      isLoadingTasks,
      toggleTaskForm,
      isTaskFormOpened,
      handleCloseTaskModal,
      handleTaskCreation,
      isModalWindowOpened,
      isTaskEditMode,
      activeTaskData,
      setViewMode,
      isViewModeInProgress,
      sortDirection,
      tasksToView,
      handleChangeSortDirection,
      handleTaskOpen,
      handleTaskConfigure,
      handleDeleteTask,
      deleteTask,
      activeTask,
      handleRemoveTask,
      createNewNotification,
      handleMoveTaskBack,
      handleCloseDeletionModal,
      deleteTaskData,
      clearDoneTasks,
    ]
  );

  return (
    <StateContext.Provider value={memoizedValue}>
      {children}
    </StateContext.Provider>
  );
};

const useStateContext = () => useContext(StateContext);

export { StateContextProvider, useStateContext };
