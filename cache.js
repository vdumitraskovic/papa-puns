import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "papa_puns_daily_joke";

const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const readDailyJoke = async () => {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
};

export const writeDailyJoke = async (joke) => {
  const payload = {
    date: getTodayKey(),
    joke,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const isToday = (dateKey) => dateKey === getTodayKey();
