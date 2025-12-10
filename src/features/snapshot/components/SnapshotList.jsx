// common/components/classroom/SnapshotList.jsx
import styles from '../styles/SnapshotList.module.css';

const SnapshotList = ({ 
    snapshots, 
    selectedId, 
    onSelect, 
    onRestore,
    showRestoreButton = true 
}) => {
    return (
        <div className={styles.container}>
            {snapshots.map((snapshot) => (
                <button
                    key={snapshot.id}
                    className={`${styles.item} ${selectedId === snapshot.id ? styles.active : ''}`}
                    onClick={() => onSelect(snapshot)}
                >
                    <span className={styles.name}>{snapshot.name}</span>
                    <span className={styles.time}>{snapshot.createdAt}</span>
                    {showRestoreButton && (
                        <button
                            className={styles.restoreButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRestore(snapshot);
                            }}
                        >
                            복원
                        </button>
                    )}
                </button>
            ))}
        </div>
    );
};

export default SnapshotList;
