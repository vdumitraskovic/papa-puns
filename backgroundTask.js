import * as BackgroundFetch from "expo-background-fetch";
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

      if (result.fromCache) {
        return BackgroundFetch.BackgroundFetchResult.NoData;
      }

      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (e) {
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });
}

export const registerDailyJokeBackgroundTask = async () => {
  const status = await BackgroundFetch.getStatusAsync();
  if (
    status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
    status === BackgroundFetch.BackgroundFetchStatus.Denied
  ) {
    return false;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(DAILY_JOKE_BACKGROUND_TASK);
  if (isRegistered) {
    return true;
  }

  await BackgroundFetch.registerTaskAsync(DAILY_JOKE_BACKGROUND_TASK, {
    minimumInterval: 60 * 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });

  return true;
};
