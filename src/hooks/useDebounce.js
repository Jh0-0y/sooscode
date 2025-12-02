import { useState, useEffect } from "react";

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value가 바뀔 때마다 기존 타이머 제거
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
