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
import { storeData } from "./utils/storage";
import { ITask } from "./models";
import { schedulePushNotification } from "./utils/notifications";
import getRandom from "./utils/getRandom";

//components
import TaskFilterButtons from "./components/TaskFilterButtons";
import NewTaskModalForm from "./components/NewTaskModalForm";
import NewTaskContainer from "./components/NewTaskContainer";
import SplashScreen from "./components/SplashScreen";
import TaskList from "./components/TaskList";
import ModalWindow from "./components/Modal";
import TaskForm from "./components/TaskForm";

//hooks
import useNotificationRegister from "./hooks/useNotificationRegister";
import useBackgroundImage from "./hooks/useBackgroundImage";
import useManageTask from "./hooks/useManageTask";
import useTasksList from "./hooks/useTasksList";
import useAppState from "./hooks/useAppState";
import useViewMode from "./hooks/useViewMode";

const backgroundPaths = [
  require("./assets/background/nature-1.jpg"),
  require("./assets/background/nature-2.jpg"),
  require("./assets/background/nature-3.jpg"),
  require("./assets/background/nature-4.jpg"),
  require("./assets/background/nature-5.jpg"),
  require("./assets/background/nature-6.jpg"),
  require("./assets/background/nature-7.jpg"),
  require("./assets/background/nature-8.jpg"),
  require("./assets/background/nature-9.jpg"),
  require("./assets/background/nature-10.jpg"),
];

const prefabImage = backgroundPaths[getRandom(0, backgroundPaths.length - 1)];

//todo: remove task that is not repeatable immediately
//todo: split states into one global and use reducer
//todo: we should store tasks at some kind of local storage
//todo: the main idea is - when user reopen application, show him loader, while loader spinning
// we just map through tasks id array, check task timer - if timer is ended - task should be removed, if its not repeatable
//if its repeatable - task should be marked as done
//need to display splanscreen component while maintaining tasks in background - get from store, map through them, other operations

// create hooks folder, create useInitiate hook, create ENUM with all kind of keys that we use
// we need state to indicate if application should reinitiate or not, when app in background, we should set state into true or when its first launch
// then we should reinitiate app, get all tasks from store, delete those thats not repeataple and already fired
// those which repeatable we need to in doneTasks, others in all tasks list, while we initiate we show splashcreen component
//after initiation we need to update inner local storage with new set of tasks, because we might delete some of them
//if user change title, change trigger or repeatable state, or description - we should get from localstore array, map thorugh it,
// find needed task, update object, set it back
//we need to create reducers, too much logic layer app file containing

const App = (): JSX.Element => {
  //initiate notification service
  const { expoPushToken, notification } = useNotificationRegister();

  const { currentImagePath } = useBackgroundImage(backgroundPaths);

  const { isAppVisible } = useAppState();

  const { viewMode, setViewMode, isViewModeInProgress } = useViewMode();
  const {
    isModalWindowOpened,
    isTaskEditMode,
    activeTask,
    setModalOpened,
    setTaskEditMode,
    setActiveTask,
  } = useManageTask();

  const {
    isLoading,
    createNewTask,
    updateTask,
    removeTask,
    markTaskAsUndone,
    tasksToView,
    activeTaskData,
  } = useTasksList(isViewModeInProgress, activeTask);

  const handleCloseModal = useCallback(() => {
    setModalOpened(false);
    setActiveTask("");
  }, []);

  const handleResetOpenedTask = useCallback(() => {
    handleCloseModal();
    setTaskEditMode(false);
  }, []);

  const handleTaskOpen = useCallback((id: string) => {
    setActiveTask(id);
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

  useEffect(() => {
    if (isAppVisible) {
      AsyncStorage.getItem("taskTime").then(async (value) => {
        if (value !== null) {
          const currentDate = new Date();
          const taskDate = new Date(value);

          if (!(taskDate > currentDate)) {
            await AsyncStorage.removeItem("taskTime");
            await AsyncStorage.removeItem("notificationId");
          }
        } else {
          await AsyncStorage.removeItem("notificationId");
        }
      });
    }
  }, [isAppVisible]);

  const handleRemoveTask = useCallback(() => {
    removeTask(viewMode, activeTask);

    handleCloseModal();
  }, [viewMode, activeTask]);

  const handleMoveTaskBack = useCallback(() => {
    markTaskAsUndone(activeTask);

    handleCloseModal();
  }, [activeTask]);

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
          />

          <ModalWindow
            onCloseModal={handleResetOpenedTask}
            isWindowOpened={isModalWindowOpened && !isTaskEditMode}
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
            onCloseModal={handleResetOpenedTask}
            isWindowOpened={isModalWindowOpened && isTaskEditMode}
          >
            <NewTaskModalForm onAdd={handleChangeTask} task={activeTaskData} />
          </ModalWindow>

          <NewTaskContainer onAdd={handleCreateNewTask} />
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

export default App;
