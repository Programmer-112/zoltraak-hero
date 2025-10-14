import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(duration = 5000) {
  const [progress, setProgress] = useState(100);
  const [isTimedOut, setIsTimedOut] = useState(false);
  // eslint-disable-next-line no-undef
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    setProgress(100);
    setIsTimedOut(false);
    const start = Date.now();

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const remaining = duration - (Date.now() - start);
      const pct = Math.max((remaining / duration) * 100, 0);
      setProgress(pct);

      if (pct <= 0) {
        setIsTimedOut(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 50);
  }, [duration]);

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTimer]);

  const resetTimer = () => startTimer();

  return { progress, isTimedOut, resetTimer };
}
