import { useRef } from "react";

export const useDebounce = (mainFunction, delay = 2000) => {
  const timeoutRef = useRef(null);

  return (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
};