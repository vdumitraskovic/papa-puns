import { useState, useCallback, useEffect, useRef } from "react";
import { readDailyJoke, writeDailyJoke, isToday } from "./cache";

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

  const fetchAndCacheJoke = useCallback(async () => {
    commitPending();
    try {
      const response = await fetchRandomJoke();
      await writeDailyJoke(response);
      commitSuccess(response);
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

    await fetchAndCacheJoke();
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
    refreshJoke: fetchAndCacheJoke,
  };
};
