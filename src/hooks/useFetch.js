import { useEffect, useState } from "react";

export const useFetch = (url, options, successCB, errorCB) => {
    const [response, setResponse] =useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [responseStatusCode, setResponseStatusCode] = useState(null);
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(url, options);
          setResponseStatusCode(res.status);
          const json = await res.json();
          setIsLoading(false);
          if(res.status === 200 || res.isLoggedIn){
            successCB(json);
            setResponse(json);
            return;
          }
          errorCB(json);
          setError(json);
          return;
        } catch (error) {
          setError(error);
        }
      };
      fetchData();
    }, []);
    return { response, responseStatusCode, error, isLoading };
};