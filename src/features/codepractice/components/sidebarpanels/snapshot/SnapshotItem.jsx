import styles from "./SnapshotItem.module.css";
import { formatDate } from "../../../../../utils/date";
import { X } from "lucide-react";
export default function SnapshotItem({ snapshot,onClick,onDelete}) {

  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.title}>
        {snapshot.title}
        <button
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(snapshot.codeSnapshotId);
          }}
        >
          <X size={14} />
        </button>
      </div>
      <div className={styles.meta}>
        {formatDate(snapshot.createdAt)}
      </div>
    </div>
  );
}
