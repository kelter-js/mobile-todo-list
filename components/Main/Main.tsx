import { useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//other
import { storeData } from "../../utils/storage";
import { ITask } from "../../models";
import { schedulePushNotification } from "../../utils/notifications";
import getRandom from "../../utils/getRandom";

//components
import TaskFilterButtons from "../TaskFilterButtons";
import NewTaskModalForm from "../NewTaskModalForm";
import NewTaskContainer from "../NewTaskContainer";
import SplashScreen from "../SplashScreen";
import TaskList from "../TaskList";
import ModalWindow from "../Modal";
import TaskForm from "../TaskForm";

//hooks
import useNotificationRegister from "../../hooks/useNotificationRegister";
import useBackgroundImage from "../../hooks/useBackgroundImage";
import useManageTask from "../../hooks/useManageTask";
import useTasksList from "../../hooks/useTasksList";
import useAppState from "../../hooks/useAppState";
import useViewMode from "../../hooks/useViewMode";
import { ConfirmDeletion } from "../ConfirmDeletion";

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

const prefabImage = backgroundPaths[getRandom(0, backgroundPaths.length - 1)];
const DELETION_MODAL_HEIGHT = 140;

//todo: split states into one global and use reducer
//we need to create reducers, too much logic layer app file containing

//we need to check that user selected new date, before we put task from done to task in progress
//we need to add sort task list button for date in ASC and DESC orders

//we need to remove scheduled notification if user delete or set task as done

//we need to check when we change or create task, in callback we should set new notification
//when change apply - check old trigger date and new trigger date, if they arent the same

const Main = (): JSX.Element => {
  //initiate notification service
  const { expoPushToken, notification } = useNotificationRegister();

  const { currentImagePath } = useBackgroundImage(backgroundPaths);

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
    removeTask,

    markTaskAsUndone,
    tasksToView,
    activeTaskData,
    deleteTaskData,
    clearDoneTasks,
  } = useTasksList(isViewModeInProgress, activeTask, deleteTask);

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

  const createNewNotification = async (
    remindDate: Date,
    taskId: string | Uint8Array
  ) => {
    const { date, notificationId } = await schedulePushNotification(
      activeTask,
      remindDate
    );

    handleCloseModal();

    await storeData("taskTime", date.toString());
    await storeData("notificationId", notificationId);
    await storeData("taskId", taskId);
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

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ImageBackground
        resizeMode="cover"
        style={styles.backgroundImage}
        source={currentImagePath || prefabImage}
      />

      <View style={styles.contentContainer}>
        <View style={styles.tasksContainer}>
          <Text style={styles.sectionTitle}>Today`s tasks</Text>

          <TaskFilterButtons
            setViewMode={setViewMode}
            isViewModeInProgress={isViewModeInProgress}
          />

          <TaskList
            tasks={tasksToView}
            onTaskOpen={handleTaskOpen}
            onTaskConfigure={handleTaskConfigure}
            isViewModeInProgress={isViewModeInProgress}
            onTaskDelete={handleDeleteTask}
          />

          <ModalWindow
            onCloseModal={handleResetOpenedTask}
            isWindowOpened={
              isModalWindowOpened && !isTaskEditMode && !deleteTask
            }
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

          <ModalWindow
            onCloseModal={handleResetOpenedTask}
            isWindowOpened={isModalWindowOpened && isTaskEditMode}
          >
            <NewTaskModalForm onAdd={handleChangeTask} task={activeTaskData} />
          </ModalWindow>

          <NewTaskContainer
            onAdd={handleCreateNewTask}
            onClear={clearDoneTasks}
            isViewModeInProgress={isViewModeInProgress}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  contentContainer: {
    position: "relative",
    flex: 1,
  },
  tasksContainer: {
    flex: 1,
    marginTop: 60,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

export default Main;
