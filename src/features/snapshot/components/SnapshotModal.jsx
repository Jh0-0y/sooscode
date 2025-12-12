import { useState } from 'react';
import styles from '../styles/SnapshotModal.module.css';

/**
 * 스냅샷 저장을 위해 제목을 입력받는 모달 컴포넌트
 */
const SnapshotModal = ({ isOpen, onClose, onConfirm }) => {
    const [title, setTitle] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        onConfirm(title);
        setTitle('');
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>스냅샷 저장</h3>

                <input
                    type="text"
                    className={styles.input}
                    placeholder="스냅샷 제목을 입력하세요 (예: 반복문 실습)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                />

                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        취소
                    </button>
                    <button className={styles.saveButton} onClick={handleSubmit}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SnapshotModal;