import { useState, useEffect, useRef, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  AppState,
  Keyboard,
  ImageBackground,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import uuid from "react-native-uuid";

import { storeData } from "./utils/storage";
import { ITask } from "./components/Task";
import TaskList from "./components/TaskList";
import NewTaskForm from "./components/NewTaskForm";
import getRandom from "./utils/getRandom";
import ModalWindow from "./components/Modal";
import {
  schedulePushNotification,
  registerForPushNotificationsAsync,
} from "./utils/notifications";

const screenWidth = Dimensions.get("window").width;
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

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<any>(false);
  const [openedTask, setOpenedTask] = useState("");
  const [isModalWindowOpened, setModalOpened] = useState(false);
  const [currentImagePath, setCurrentImagePath] = useState();

  const handleResetOpenedTask = useCallback(() => {
    setModalOpened(false);
    setOpenedTask("");
  }, []);

  const handleTaskOpen = useCallback((id: string) => {
    setOpenedTask(id);
  }, []);

  const [tasks, setTasks] = useState<ITask[]>([
    { id: uuid.v1(), text: "first task" },
    { id: uuid.v1(), text: "second task" },
    { id: uuid.v1(), text: "test task" },
  ] as ITask[]);

  const handleCreateNewTask = (taskText: string) => {
    Keyboard.dismiss();
    setTasks((state) => [...state, { id: uuid.v1(), text: taskText }]);
  };

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  console.log("opened task:", openedTask);
  console.log("isModalWindowOpened in app:", isModalWindowOpened);

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
    const taskToRemove = tasks.find((item) => item.id === openedTask);

    if (taskToRemove) {
      const taskIndex = tasks.indexOf(taskToRemove);
      setTasks([...tasks.slice(0, taskIndex), ...tasks.slice(taskIndex + 1)]);
    }

    setOpenedTask("");
    setModalOpened(false);
  }, [tasks, openedTask]);

  useEffect(() => {
    const timerId = setInterval(() => {
      const newImageSrc =
        backgroundPaths[getRandom(0, backgroundPaths.length - 1)];
      setCurrentImagePath(newImageSrc);
    }, 6500);

    return () => clearInterval(timerId);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
      <ImageBackground
        resizeMode="cover"
        style={styles.backgroundImage}
        source={currentImagePath || prefabImage}
      />
      <View style={styles.blurred} />

      <View style={styles.contentContainer}>
        <View style={styles.tasksContainer}>
          <Text style={styles.sectionTitle}>Today`s tasks</Text>

          <TaskList tasks={tasks} onTaskOpen={handleTaskOpen} />

          {isModalWindowOpened && (
            <ModalWindow
              taskId={String(openedTask)}
              onCloseModal={handleResetOpenedTask}
              onRemoveTask={handleRemoveTask}
              onCreateReminder={createNewNotification}
            />
          )}

          <NewTaskForm addNewTask={handleCreateNewTask} />
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
    marginTop: 80,
    marginHorizontal: 10,
    paddingHorizontal: 10,
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
  blurred: {
    position: "absolute",
    top: 70,
    left: 10,
    width: screenWidth - 20,
    height: "50%",
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "saturate(180%) blur(10px)",
  },
});

export default App;
