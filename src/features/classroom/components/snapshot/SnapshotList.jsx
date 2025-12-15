import styles from "./SnapshotList.module.css";
import { formatDate } from "@/utils/date";

const SnapshotList = ({ snapshots, onSelect, listRef }) => {
    return (
        <div ref={listRef} className={styles.container}>
            {snapshots.map((snapshot) => (
                <button
                    key={snapshot.snapshotId}
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
            ))}
        </div>
    );
};

export default SnapshotList;