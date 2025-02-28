import { useEffect, useCallback, useState } from "react";
import { LinearGradient } from "react-native-svg";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  ImageBackground,
  Dimensions,
} from "react-native";

//other
import { ITask } from "../../models";
import {
  cancelScheduledNotification,
  schedulePushNotification,
} from "../../utils/notifications";
import getRandom from "../../utils/getRandom";

//components
import TaskFilterButtons from "../TaskFilterButtons";
import NewTaskModalForm from "../NewTaskModalForm";
import NewTaskContainer from "../NewTaskContainer";
import SplashScreen from "../../view/SplashScreen";
import TaskList from "../TaskList";
import ModalWindow from "../Modal";
import TaskForm from "../TaskForm";

//hooks
import useNotificationRegister from "../../hooks/useNotificationRegister";
import useBackgroundImage from "../../hooks/useBackgroundImage";
import useManageTask from "../../hooks/useManageTask";
import useTasksList from "../../hooks/useTasksList";
import useViewMode from "../../hooks/useViewMode";
import { ConfirmDeletion } from "../ConfirmDeletion";
import { EditView } from "../../view/EditView";
import { reScheduleTasks } from "../../hooks/useInitiateTasks";

const backgroundPaths = [
  require("../../assets/background/nature-1.jpg"),
  require("../../assets/background/nature-2.jpg"),
  require("../../assets/background/nature-3.jpg"),
  require("../../assets/background/nature-4.jpg"),
  require("../../assets/background/nature-5.jpg"),
  require("../../assets/background/nature-6.jpg"),
  require("../../assets/background/nature-7.jpg"),
  require("../../assets/background/nature-8.jpg"),
  require("../../assets/background/nature-9.jpg"),
  require("../../assets/background/nature-10.jpg"),
];

const prefabImage = require("../../assets/background/static-bg.jpg");
const DELETION_MODAL_HEIGHT = 160;
const MIN_AMOUNT_OF_TASKS_TO_SORT = 1;
const windowHeight = Dimensions.get("window").height;

//todo: split states into one global and use reducer
//we need to create reducers, too much logic layer app file containing

//we need to check that user selected new date, before we put task from done to task in progress
//we need to add sort task list button for date in ASC and DESC orders

//we create new ui

//maybe we should somehow dispatch ui updates to check if task is complete

//selected by user time validation during editing task card - we should somehow inform user why button is disabled
//if card has checkbox task is repeatable, instead of timepicker, we need to show him field like
//повторять - пользователь выбирает от 0 до 60, затем каждые - и здесь сущность выбирает пользователь, минуты, часы, дни.

// нужно реализовать логику в которой если таска повторяемая, как только отрабатывае тнапоминание - мы тут же создаем новое исходя из настроек таски

const Main = (): JSX.Element => {
  //initiate notification service
  const { expoPushToken, notifications, setNotifications } =
    useNotificationRegister();

  const { currentImagePath } = useBackgroundImage(backgroundPaths);

  const { viewMode, setViewMode, isViewModeInProgress } = useViewMode();
  console.log("isViewModeInProgress", isViewModeInProgress);
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

  console.log("activetask", activeTask);

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

  console.log("tasksToView", tasksToView);

  useEffect(() => {
    if (notifications.length !== 0) {
      const notificationsIds = notifications.map(
        (notification) => notification.request.identifier
      );
      const tasksToReplan = [...doneTasks, ...tasksList].filter(
        (task) =>
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

  const handleTaskCreation = useCallback((data: Omit<ITask, "id">) => {
    handleCreateNewTask(data);
    setTaskFormOpened(false);
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

  const handleResetOpenedTask = useCallback(() => {
    handleCloseModal();
    setTaskEditMode(false);
  }, []);

  const handleTaskOpen = useCallback((id: string) => {
    setActiveTask(id);
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setDeleteTask(id);
    setModalOpened(true);
  }, []);

  const handleTaskConfigure = useCallback((id: string) => {
    setTaskEditMode(true);
    setActiveTask(id);
  }, []);

  const handleCreateNewTask = (taskData: Omit<ITask, "id">) => {
    Keyboard.dismiss();
    createNewTask(taskData);
    handleResetOpenedTask();
  };

  const handleChangeTask = (taskData: ITask) => {
    Keyboard.dismiss();

    updateTask(taskData);

    handleResetOpenedTask();
  };

  useEffect(() => {
    if (Boolean(activeTask.trim())) {
      setModalOpened(true);
    }
  }, [activeTask]);

  const createNewNotification = async (remindDate: Date, task: ITask) => {
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

  // useEffect(() => {
  //   if (isAppVisible) {
  //     AsyncStorage.getItem("taskTime").then(async (value) => {
  //       if (value !== null) {
  //         const currentDate = new Date();
  //         const taskDate = new Date(value);

  //         if (!(taskDate > currentDate)) {
  //           await AsyncStorage.removeItem("taskTime");
  //           await AsyncStorage.removeItem("notificationId");
  //         }
  //       } else {
  //         await AsyncStorage.removeItem("notificationId");
  //       }
  //     });
  //   }
  // }, [isAppVisible]);

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

  if (isLoadingTasks) {
    return <SplashScreen />;
  }

  const handleCloseTaskCreation = () => {
    setTaskFormOpened(false);
  };

  if (isTaskFormOpened) {
    return (
      <EditView onClose={handleCloseTaskCreation}>
        <NewTaskModalForm
          onClose={handleCloseTaskCreation}
          onAdd={handleTaskCreation}
        />
      </EditView>
    );
  }

  if (isModalWindowOpened && isTaskEditMode) {
    return (
      <EditView onClose={handleResetOpenedTask}>
        <NewTaskModalForm
          onClose={handleResetOpenedTask}
          onAdd={handleChangeTask}
          task={activeTaskData}
        />
      </EditView>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        height: windowHeight,
        maxHeight: windowHeight,
        overflow: "hidden",
      }}
    >
      <ImageBackground
        resizeMode="cover"
        style={styles.backgroundImage}
        source={prefabImage}
      />

      <View style={styles.tasksContainer}>
        <Text style={styles.sectionTitle}>Задачи</Text>

        <TaskFilterButtons
          setViewMode={setViewMode}
          isViewModeInProgress={isViewModeInProgress}
          sortDirection={sortDirection}
          handleChangeSortDirection={handleChangeSortDirection}
          hasSortButton={tasksToView.length > MIN_AMOUNT_OF_TASKS_TO_SORT}
        />
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TaskList
            tasks={tasksToView}
            onTaskOpen={handleTaskOpen}
            onTaskConfigure={handleTaskConfigure}
            isViewModeInProgress={isViewModeInProgress}
            onTaskDelete={handleDeleteTask}
          />
        </ScrollView>

        {/* view task card */}
        <ModalWindow
          onCloseModal={handleResetOpenedTask}
          isWindowOpened={isModalWindowOpened && !isTaskEditMode && !deleteTask}
        >
          <TaskForm
            taskId={String(activeTask)}
            onRemoveTask={handleRemoveTask}
            onMoveTaskBack={handleMoveTaskBack}
            onCreateReminder={createNewNotification}
            isViewModeInProgress={isViewModeInProgress}
            task={activeTaskData}
          />
        </ModalWindow>

        {/* delete task */}
        <ModalWindow
          onCloseModal={handleCloseDeletionModal}
          isWindowOpened={Boolean(isModalWindowOpened && deleteTask)}
          height={DELETION_MODAL_HEIGHT}
        >
          <ConfirmDeletion
            taskId={String(deleteTask)}
            onRemoveTask={handleRemoveTask}
            task={deleteTaskData}
            onClose={handleCloseDeletionModal}
          />
        </ModalWindow>
      </View>

      <NewTaskContainer
        toggleTaskForm={toggleTaskForm}
        onClear={clearDoneTasks}
        disabled={!isViewModeInProgress && tasksToView.length === 0}
        isViewModeInProgress={isViewModeInProgress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    height: windowHeight,
  },

  tasksContainer: {
    marginTop: 15,
    marginHorizontal: 10,
    height: "100%",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#b6b7b8",
    textAlign: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

export default Main;
