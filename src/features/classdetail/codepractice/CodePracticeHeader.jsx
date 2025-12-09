import { ChevronLeft } from "lucide-react";
import styles from "./CodePracticeHeader.module.css";
import { useNavigate } from "react-router-dom";

export default function CodePracticeHeader({ classTitle = "코드 연습", onSave, onRun }) {
  const navigate = useNavigate();

  return (
    <header className={styles.wrapper}>
      {/* Left: Back + Title */}
      <div className={styles.left}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <span className={styles.title}>{classTitle}</span>
      </div>

      {/* Right: Actions */}
      <div className={styles.right}>
        <button className={styles.actionBtn} onClick={onSave}>저장</button>
        <button className={`${styles.actionBtn} ${styles.runBtn}`} onClick={onRun}>
          실행
        </button>
      </div>
    </header>
  );
}
