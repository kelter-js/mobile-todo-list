import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import { NewTaskNotification } from "../models";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function schedulePushNotification({
  text,
  title,
  date,
}: NewTaskNotification) {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${title}`,
      body: `${text}`,
      data: { data: `reminder will fire at: ${date.toLocaleString()}` },
    },
    trigger: date,
    identifier: "testIdentifier",
  })
    .then((res) => {
      Alert.alert("registered successfully!");
      return res;
    })
    .catch((err) => Alert.alert("failed to create notification!", err));

  return { notificationId, date };
}

export async function cancelScheduledNotification(notificationId: string) {
  Alert.alert(`task id, which need to be cancelled: ${notificationId}`);

  await Notifications.cancelScheduledNotificationAsync(notificationId)
    .then(() => Alert.alert("task notification successfully cancelled!"))
    .catch(() => Alert.alert("Failed to cancel task notification!"));
}

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    }).then(() => Alert.alert("registered successfully!"));
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
      Alert.alert("Failed to get push token for push notification!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  Alert.alert("registered token:", token);

  return token;
};
