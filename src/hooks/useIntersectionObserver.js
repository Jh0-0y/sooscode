import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver(options = {}) {
  const targetRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) observer.unobserve(targetRef.current);
      observer.disconnect();
    };
  }, [options]);

  return { targetRef, isIntersecting };
}
