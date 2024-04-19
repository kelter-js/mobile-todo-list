import { useState, useEffect, useRef, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  AppState,
  Keyboard,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import uuid from "react-native-uuid";

import { storeData } from "./utils/storage";
import { ITask, ViewModes } from "./models";
import {
  schedulePushNotification,
  registerForPushNotificationsAsync,
} from "./utils/notifications";
import TaskList from "./components/TaskList";
import NewTaskContainer from "./components/NewTaskContainer";
import getRandom from "./utils/getRandom";
import ModalWindow from "./components/Modal";
import TaskForm from "./components/TaskForm";
import TaskFilterButtons from "./components/TaskFilterButtons";
import NewTaskModalForm from "./components/NewTaskModalForm";

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
// we just map through tasks array, check task timer - if timer is ended - task should be removed, if its not repeatable
//if its repeatable - task should be marked as done

const INITIAL_TASKS = [
  {
    id: uuid.v1(),
    description: "blah-blah",
    title: "first task",
    isRepeatable: false,
    triggerDate: new Date("Sat Jun 13 2024 00:05:29 GMT+0500"),
  },
  {
    id: uuid.v1(),
    description: "bleh-bleh",
    title: "second task",
    isRepeatable: false,
    triggerDate: new Date("Sat Sep 13 2024 00:05:29 GMT+0500"),
  },
  {
    id: uuid.v1(),
    description: "bluh-bluh",
    title: "third task",
    isRepeatable: false,
    triggerDate: new Date("Sat Jan 13 2025 00:05:29 GMT+0500"),
  },
];

const App = (): JSX.Element => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [openedTask, setOpenedTask] = useState("");
  const [isModalWindowOpened, setModalOpened] = useState(false);
  const [currentImagePath, setCurrentImagePath] = useState();
  const [viewMode, setViewMode] = useState<keyof typeof ViewModes>(
    ViewModes.IN_PROGRESS
  );
  const [doneTasks, setDoneTasks] = useState<ITask[]>([]);
  const [isTaskEditMode, setTaskEditMode] = useState(false);

  const handleResetOpenedTask = useCallback(() => {
    setModalOpened(false);
    setTaskEditMode(false);
    setOpenedTask("");
  }, []);

  const handleTaskOpen = useCallback((id: string) => {
    setOpenedTask(id);
  }, []);

  const handleTaskConfigure = useCallback((id: string) => {
    setTaskEditMode(true);
    setOpenedTask(id);
  }, []);

  const [tasks, setTasks] = useState<ITask[]>(INITIAL_TASKS);

  const handleCreateNewTask = (taskData: Omit<ITask, "id">) => {
    Keyboard.dismiss();
    setTasks((state) => [...state, { id: uuid.v1(), ...taskData }]);
  };

  const handleChangeTask = (taskData: ITask) => {
    Keyboard.dismiss();

    const [taskToChange] = tasks.filter((task) => task.id === taskData.id);
    const taskIndex = tasks.indexOf(taskToChange);

    console.log(taskIndex);

    setTasks((state) => [
      ...state.slice(0, taskIndex),
      { ...taskData },
      ...state.slice(taskIndex + 1),
    ]);

    handleResetOpenedTask();
  };

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    if (Boolean(openedTask.trim())) {
      setModalOpened(true);
    }
  }, [openedTask]);

  const createNewNotification = async (remindDate: Date) => {
    setModalOpened(false);

    const { date, notificationId } = await schedulePushNotification(
      openedTask,
      remindDate
    );

    setOpenedTask("");

    await storeData("taskTime", date.toString());
    await storeData("taskId", notificationId);
  };

  const handleAppChange = useCallback(async () => {
    await AsyncStorage.getItem("taskTime").then(async (value) => {
      if (value !== null) {
        const currentDate = new Date();
        const taskDate = new Date(value);

        if (!(taskDate > currentDate)) {
          await AsyncStorage.removeItem("taskTime");
          await AsyncStorage.removeItem("taskId");
        }
      } else {
        await AsyncStorage.removeItem("taskId");
      }
    });
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppChange);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    handleAppChange();
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token ?? "")
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleRemoveTask = useCallback(() => {
    if (viewMode === ViewModes.IN_PROGRESS) {
      const taskToRemove = tasks.find((item) => item.id === openedTask);

      if (taskToRemove) {
        const taskIndex = tasks.indexOf(taskToRemove);

        setDoneTasks((state) => [...state, taskToRemove]);

        setTasks([...tasks.slice(0, taskIndex), ...tasks.slice(taskIndex + 1)]);
      }
    }

    if (viewMode === ViewModes.FINISHED) {
      const taskToRemove = doneTasks.find((item) => item.id === openedTask);

      if (taskToRemove) {
        const taskIndex = doneTasks.indexOf(taskToRemove);

        setDoneTasks((state) => [
          ...state.slice(0, taskIndex),
          ...state.slice(taskIndex + 1),
        ]);
      }
    }

    setOpenedTask("");
    setModalOpened(false);
  }, [tasks, openedTask, doneTasks]);

  const handleMoveTaskBack = useCallback(() => {
    const taskToMoveBack = doneTasks.find((item) => item.id === openedTask);

    if (taskToMoveBack) {
      const taskIndex = doneTasks.indexOf(taskToMoveBack);

      setTasks((state) => [...state, taskToMoveBack]);
      setDoneTasks((state) => [
        ...state.slice(0, taskIndex),
        ...state.slice(taskIndex + 1),
      ]);
    }

    setOpenedTask("");
    setModalOpened(false);
  }, [openedTask, doneTasks]);

  useEffect(() => {
    const timerId = setInterval(() => {
      const newImageSrc =
        backgroundPaths[getRandom(0, backgroundPaths.length - 1)];
      setCurrentImagePath(newImageSrc);
    }, 6500);

    return () => clearInterval(timerId);
  }, []);

  const isViewModeInProgress = viewMode === ViewModes.IN_PROGRESS;

  const [openedTaskData] = tasks.filter((item) => item.id === openedTask);

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
            tasks={isViewModeInProgress ? tasks : doneTasks}
            onTaskOpen={handleTaskOpen}
            onTaskConfigure={handleTaskConfigure}
          />

          <ModalWindow
            onCloseModal={handleResetOpenedTask}
            isWindowOpened={isModalWindowOpened && !isTaskEditMode}
          >
            <TaskForm
              taskId={String(openedTask)}
              onRemoveTask={handleRemoveTask}
              onMoveTaskBack={handleMoveTaskBack}
              onCreateReminder={createNewNotification}
              isViewModeInProgress={isViewModeInProgress}
              task={openedTaskData}
            />
          </ModalWindow>

          <ModalWindow
            onCloseModal={handleResetOpenedTask}
            isWindowOpened={isModalWindowOpened && isTaskEditMode}
          >
            <NewTaskModalForm onAdd={handleChangeTask} task={openedTaskData} />
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
