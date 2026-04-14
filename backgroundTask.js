import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { fetchAndStoreJoke } from "./api";

export const DAILY_JOKE_BACKGROUND_TASK = "daily-joke-background-task";

if (!TaskManager.isTaskDefined(DAILY_JOKE_BACKGROUND_TASK)) {
  TaskManager.defineTask(DAILY_JOKE_BACKGROUND_TASK, async () => {
    try {
      const result = await fetchAndStoreJoke({
        forceFetch: false,
        notifyOnNewJoke: true,
      });

      return BackgroundTask.BackgroundTaskResult.Success;
    } catch (e) {
      return BackgroundTask.BackgroundTaskResult.Failed;
    }
  });
}

export const registerDailyJokeBackgroundTask = async () => {
  const status = await BackgroundTask.getStatusAsync();
  if (status !== BackgroundTask.BackgroundTaskStatus.Available) {
    return false;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(DAILY_JOKE_BACKGROUND_TASK);
  if (isRegistered) {
    return true;
  }

  await BackgroundTask.registerTaskAsync(DAILY_JOKE_BACKGROUND_TASK, {
    minimumInterval: 60,
  });

  return true;
};
