import styles from "./ClassDetailHeader.module.css";

export default function ClassDetailHeader({ title }) {
  return (
    <div className={styles.header}>
      <span className={styles.path}>//SoosCode</span>
      <span className={styles.title}>{title}</span>
    </div>
  );
}
