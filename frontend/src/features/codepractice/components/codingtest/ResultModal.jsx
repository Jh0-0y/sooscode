// ResultModal.jsx
import { useCodeTestStore } from "../../store/useCodeTestStore";
import styles from "./ResultModal.module.css";

export default function ResultModal() {
  const { passed, showResultModal, isRunning, error } =
    useCodeTestStore();

  if (!showResultModal) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {isRunning ? (
          <>
            <div className={styles.loading}>
              <span className={styles.spinner} />
              <p>처리중...</p>
            </div>
            <p className={styles.subText}>
              코드를 실행하고 있습니다
            </p>
          </>
        ) : error ? (
          <>
            <h2 className={styles.fail}>실행 오류</h2>
            <p className={styles.error}>{error}</p>
          </>
        ) : passed ? (
          <h2 className={styles.pass}>정답입니다!</h2>
        ) : (
          <h2 className={styles.fail}>틀렸습니다</h2>
        )}
      </div>
    </div>
  );
}
