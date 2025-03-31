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

export const useFetchRandomJoke = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchRandomJoke();
      setData(response);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};
