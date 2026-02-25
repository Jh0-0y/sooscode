// Resize Custom Hook

import { useEffect, useRef, useState } from "react";

export function useResizableWidth({
  initialWidth = 240,
  minWidth = 200,
  maxWidth = 600,
}) {
  const [width, setWidth] = useState(initialWidth);

  const resizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!resizingRef.current) return;

      const delta = e.clientX - startXRef.current;
      const next = startWidthRef.current + delta;

      setWidth(Math.min(Math.max(next, minWidth), maxWidth));
    };

    const onMouseUp = () => {
      resizingRef.current = false;
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [minWidth, maxWidth]);

  const onResizeMouseDown = (e) => {
    e.preventDefault();
    resizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.body.style.userSelect = "none";
  };

  return {
    width,
    onResizeMouseDown,
    setWidth, // 필요하면 외부에서 조절용
  };
}
