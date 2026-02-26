import { useState, useCallback, useEffect, useRef } from "react";
import { readDailyJoke, writeDailyJoke, isToday } from "./cache";
import { scheduleNewJokeNotification } from "./notifications";

const serviceApiUrl = process.env.EXPO_PUBLIC_API_URL;
const getApiUrl = (url) => new URL(url, serviceApiUrl).toString();

const fetchRandomJoke = async () => {
  const res = await fetch(getApiUrl('/'), {
    method: "GET",
    mode: "cors",
    headers: {
      "User-Agent": "Papa Puns (https://github.com/vdumitraskovic/papa-puns)",
      Accept: "application/json",
    },
  });
  return res.json();
};

export const fetchAndStoreJoke = async ({
  forceFetch = false,
  notifyOnNewJoke = false,
} = {}) => {
  const cached = await readDailyJoke();
  const hasTodayJoke = Boolean(cached?.date && isToday(cached.date) && cached?.joke);

  if (hasTodayJoke && !forceFetch) {
    return {
      joke: cached.joke,
      fromCache: true,
      hasNewJoke: false,
    };
  }

  const response = await fetchRandomJoke();
  await writeDailyJoke(response);

  const hasNewJoke = Boolean(cached?.joke && cached?.date && !isToday(cached.date));
  if (notifyOnNewJoke && hasNewJoke) {
    await scheduleNewJokeNotification(response?.joke);
  }

  return {
    joke: response,
    fromCache: false,
    hasNewJoke,
  };
};

const State = {
  INITIAL: 'INITIAL',
  PENDING: 'PENDING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

export const useFetchRandomJoke = () => {
  const [state, setState] = useState(State.INITIAL);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const commitPending = () => {
    if (!isMountedRef.current) {
      return;
    }
    setState(State.PENDING);
  };

  const commitSuccess = (joke) => {
    if (!isMountedRef.current) {
      return;
    }
    setData(joke);
    setError(null);
    setState(State.SUCCESS);
  };

  const commitError = (err) => {
    if (!isMountedRef.current) {
      return;
    }
    setError(err);
    setState(State.ERROR);
  };

  const fetchAndCacheJoke = useCallback(async ({ forceFetch = true } = {}) => {
    commitPending();
    try {
      const result = await fetchAndStoreJoke({
        forceFetch,
        notifyOnNewJoke: false,
      });
      commitSuccess(result.joke);
    } catch (e) {
      const cached = await readDailyJoke();
      if (cached?.joke) {
        commitSuccess(cached.joke);
        return;
      }
      commitError(e);
    }
  }, []);

  const loadDailyJoke = useCallback(async () => {
    const cached = await readDailyJoke();
    if (cached?.date && isToday(cached.date) && cached?.joke) {
      commitSuccess(cached.joke);
      return;
    }

    await fetchAndCacheJoke({ forceFetch: false });
  }, [fetchAndCacheJoke]);

  useEffect(() => {
    loadDailyJoke();
  }, [loadDailyJoke]);

  return {
    data,
    error,
    isInitial: state === State.INITIAL,
    isLoading: state === State.PENDING,
    isError: state === State.ERROR,
    isSuccess: state === State.SUCCESS,
    refreshJoke: () => fetchAndCacheJoke({ forceFetch: true }),
  };
};
