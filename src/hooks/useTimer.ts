import { useState, useEffect, useRef, useCallback } from "react";

const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (!isActive && !isPaused) {
      setIsActive(true);
    } else if (isPaused) {
      setIsPaused(false);
    }
  }, [isActive, isPaused]);

  const pauseTimer = useCallback(() => {
    if (isActive && !isPaused) {
      setIsPaused(true);
      setIsActive(false);
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      }
    }
  }, [isActive, isPaused]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setSeconds(0);
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      timerId.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if ((!isActive || isPaused) && timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    };
  }, [isActive, isPaused]);

  return { seconds, startTimer, pauseTimer, resetTimer };
};

export default useTimer;
