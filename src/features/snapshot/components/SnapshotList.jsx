import styles from "../styles/SnapshotList.module.css";

/**
 * 스냅샷 리스트
 */
const SnapshotList = ({ snapshots, onSelect, listRef, observerRef }) => {
    return (
        <div ref={listRef} className={styles.container}>
            {snapshots.map((snapshot) => (
                <button
                    key={snapshot.snapshotId}
                    className={styles.item}
                    onClick={() => onSelect(snapshot)}
                >
                    <span className={styles.title}>{snapshot.title}</span>
                </button>
            ))}

            <div ref={observerRef} style={{ height: 1 }} />
        </div>
    );
};

export default SnapshotList;
