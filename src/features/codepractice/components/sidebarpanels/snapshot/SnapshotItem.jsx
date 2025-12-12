import styles from "./SnapshotItem.module.css";

export default function SnapshotItem({ snapshot,onClick }) {
  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.title}>
        {snapshot.title}
      </div>
      <div className={styles.meta}>
        {snapshot.createdAt}
      </div>
    </div>
  );
}
