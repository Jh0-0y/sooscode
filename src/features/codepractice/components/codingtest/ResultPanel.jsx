import styles from "./ResultPanel.module.css";

export default function ResultPanel() {
  return (
    <section className={styles.result}>
      <div className={styles.resultHeader}>
        
        <span className={styles.title}>실행 결과</span>
      </div>
    </section>
  );
}
