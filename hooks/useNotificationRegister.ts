import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";

import { registerForPushNotificationsAsync } from "../utils/notifications";

const useNotificationRegister = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notifications, setNotifications] = useState<
    Notifications.Notification[]
  >([]);

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token ?? "")
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        setNotifications((state) => [...state, notification]);
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

  return { expoPushToken, notifications, setNotifications };
};

export default useNotificationRegister;
