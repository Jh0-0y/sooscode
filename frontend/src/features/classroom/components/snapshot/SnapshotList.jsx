import styles from "./SnapshotList.module.css";
import { formatDate } from "@/utils/date";
import { FiTrash2 } from "react-icons/fi";

const SnapshotList = ({ snapshots, onSelect, listRef, onDelete }) => {
    return (
        <div ref={listRef} className={styles.container}>
            {snapshots.map((snapshot) => (
                <div key={snapshot.snapshotId} className={styles.itemWrapper}>
                    <button
                        className={styles.item}
                        onClick={() => onSelect(snapshot)}
                    >
                        <div className={styles.metaInfo}>
                            <span className={`${styles.badge} ${styles[snapshot.language?.toLowerCase()] || styles.text}`}>
                                {snapshot.language || 'TEXT'}
                            </span>
                            <span className={styles.date}>
                                {formatDate(snapshot.createdAt || snapshot.updatedAt)}
                            </span>
                        </div>
                        <span className={styles.title}>{snapshot.title}</span>
                    </button>

                    <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(snapshot);
                        }}
                        title="스냅샷 삭제"
                    >
                        <FiTrash2 />
                    </button>
                </div>
            ))}
        </div>
    );
};
export default SnapshotList;