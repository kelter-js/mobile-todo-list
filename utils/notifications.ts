import { Alert, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function schedulePushNotification(text: string, date: Date) {
  Alert.alert(`reminder will fire at: ${date.toLocaleString()}`);
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${text}`,
      body: `${text}`,
      data: { data: `reminder will fire at: ${date.toLocaleString()}` },
    },
    trigger: date,
    identifier: "testIdentifier",
  }).then((res) => {
    Alert.alert("registered successfully!");
    return res;
  });

  return { notificationId, date };
}

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    }).then(() => {
      Alert.alert("registered successfully!");
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
      Alert.alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }
  Alert.alert("registered token:", token);

  return token;
};
