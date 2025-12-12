import { createPortal } from "react-dom";
import styles from "../styles/SnapshotModal.module.css";

const SnapshotRestoreModal = ({ isOpen, onClose, onConfirm, snapshotTitle }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>스냅샷 복원</h3>

                <div style={{ padding: 'var(--spacing-2) 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    <p><strong>'{snapshotTitle}'</strong> 코드를 불러오시겠습니까?</p>
                    <p style={{ marginTop: 'var(--spacing-2)', color: 'var(--color-danger)' }}>
                         현재 작성 중인 코드가 모두 덮어씌워집니다.
                    </p>
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        취소
                    </button>

                    <button className={styles.saveButton} onClick={onConfirm}>
                        확인
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SnapshotRestoreModal;