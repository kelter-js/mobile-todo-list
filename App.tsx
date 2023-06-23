import { useState, useEffect, useRef, useCallback } from "react";
import {
  Text,
  View,
  Platform,
  StyleSheet,
  ScrollView,
  AppState,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { storeData } from "./utils/storage";
import { ITask } from "./components/Task";
import TaskList from "./components/TaskList";
import NewTaskForm from "./components/NewTaskForm";
import ModalWindow from "./components/Modal";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function schedulePushNotification(text: string) {
  const currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() + 1);

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${text}`,
      body: `${text}`,
      data: { data: "goes here" },
    },
    trigger: currentTime,
    identifier: "testIdentifier",
  });

  return { notificationId, currentTime };
}

const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      //alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    //alert('Must use physical device for Push Notifications');
  }

  return token;
};

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState<any>("");
  const [notification, setNotification] = useState<any>(false);
  const [openedTask, setOpenedTask] = useState<string | null>(null);

  const [tasks, setTasks] = useState<ITask[]>([
    { text: "first task" },
    { text: "second task" },
    { text: "test task" },
  ] as ITask[]);

  const handleCreateNewTask = (taskText: string) => {
    Keyboard.dismiss();
    setTasks((state) => [...state, { text: taskText }]);
    createNewNotification(taskText);
  };

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const createNewNotification = async (text: string) => {
    const { currentTime, notificationId } = await schedulePushNotification(
      text
    );
    await storeData("taskTime", currentTime.toString());
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
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (ontification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          console.log(response);
        }
      );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleRemoveTask = (index: number) => {
    setTasks([...tasks.slice(0, index), ...tasks.slice(index + 1)]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <View style={styles.tasksContainer}>
          <Text style={styles.sectionTitle}>Today`s tasks</Text>

          <TaskList tasks={tasks} onRemove={handleRemoveTask} />
          <ModalWindow />

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
    backgroundColor: "#E8EAED",
  },
  tasksContainer: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default App;
