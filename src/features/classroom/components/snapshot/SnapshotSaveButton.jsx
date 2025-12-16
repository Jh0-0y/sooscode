import styles from "./SnapshotSaveButton.module.css";

/**
 * 현재 코드 스냅샷 저장 버튼 컴포넌트
 *
 * @param {boolean} loading - 저장 중 여부
 * @param {Function} onClick - 저장 버튼 클릭 핸들러
 */
const SnapshotSaveButton = ({ loading, onClick }) => {
    return (
        <button
            className={styles.saveButton}
            onClick={onClick}
            disabled={loading}
        >
            {loading ? "저장 중..." : "+ 현재 코드 스냅샷 저장"}
        </button>
    );
};
export default SnapshotSaveButton;
