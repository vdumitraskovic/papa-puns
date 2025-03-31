import { useState, useEffect, useCallback } from "react";

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

  const fetchData = useCallback(async () => {
    setState(State.PENDING);
    try {
      const response = await fetchRandomJoke();
      setData(response);
      setError(null);
      setState(State.SUCCESS);
    } catch (e) {
      setError(e);
      setState(State.ERROR);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    isInitial: state === State.INITIAL,
    isLoading: state === State.PENDING,
    isError: state === State.ERROR,
    isSuccess: state === State.SUCCESS,
    refetch: fetchData,
  };
};
