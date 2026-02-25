import { useState, useRef } from "react";
import styles from './CodePracticeCompileContainer.module.css';
import scroll from '../styles/CustumScroll.module.css';

export default function CodePracticeOutputContainer({
  title = "Output",
  output = ""
}) {
  const [height, setHeight] = useState(150); // 기본 높이(px)
  const startY = useRef(0);
  const startHeight = useRef(0);

  const handleMouseDown = (e) => {
    startY.current = e.clientY;
    startHeight.current = height;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
  // 마우스 반대 방향으로 height 변화하도록 부호 반전
  const diff = startY.current - e.clientY;

  const newHeight = Math.max(100, startHeight.current + diff);
  setHeight(newHeight);
};


  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className={styles.wrapper} style={{ height }}>
      {/* Header로 리사이징 */}
      <div
        className={styles.header}
        onMouseDown={handleMouseDown}
      >
        {title}
      </div>

      <pre className={`${styles.outputText} ${scroll.yScroll}`}>
        {output}
      </pre>
    </div>
  );
}
