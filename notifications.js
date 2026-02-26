import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const NEW_JOKE_CHANNEL_ID = "new-joke-alerts";
const JOKE_PREVIEW_MAX_LENGTH = 85;

export const configureNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

const ensureAndroidChannel = async () => {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(NEW_JOKE_CHANNEL_ID, {
    name: "New Joke Alerts",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
};

export const ensureNotificationsReady = async ({ requestPermission = true } = {}) => {
  await ensureAndroidChannel();

  if (!Device.isDevice) {
    return false;
  }

  const currentPermissions = await Notifications.getPermissionsAsync();
  if (currentPermissions.granted) {
    return true;
  }

  if (!requestPermission) {
    return false;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();
  return requestedPermissions.granted;
};

const toJokePreview = (joke) => {
  if (!joke || typeof joke !== "string") {
    return "A fresh dad joke just landed...";
  }

  const compact = joke.trim().replace(/\s+/g, " ");
  if (compact.length <= 24) {
    const compactLimit = Math.max(10, compact.length - 6);
    return `${compact.slice(0, compactLimit)}...`;
  }

  const previewLimit = Math.min(JOKE_PREVIEW_MAX_LENGTH, Math.floor(compact.length * 0.65));
  const shortened = compact.slice(0, previewLimit);
  const breakAtSpace = shortened.lastIndexOf(" ");
  const preview = breakAtSpace > 25 ? shortened.slice(0, breakAtSpace) : shortened;

  return `${preview}...`;
};

export const scheduleNewJokeNotification = async (joke) => {
  const hasPermission = await ensureNotificationsReady({ requestPermission: false });
  if (!hasPermission) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "A new Papa Pun is ready",
      body: `${toJokePreview(joke)} Tap to read the full joke in the app.`,
      sound: true,
      data: {
        type: "daily_joke",
      },
    },
    trigger: null,
  });
};
