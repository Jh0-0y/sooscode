import styles from './SnapshotPagination.module.css';

const SnapshotPagination = ({ currentPage, totalPages, onPageChange, isRecentMode }) => {
    return (
        <div className={styles.container}>
            <button
                className={styles.pageBtn}
                disabled={isRecentMode || currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                title="이전 페이지"
            >
                ‹
            </button>

            <span className={styles.pageInfo}>
                {isRecentMode ? '-' : `${currentPage + 1} / ${totalPages}`}
            </span>

            <button
                className={styles.pageBtn}
                disabled={isRecentMode || currentPage >= totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
                title="다음 페이지"
            >
                ›
            </button>
        </div>
    );
};
export default SnapshotPagination;