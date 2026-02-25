import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './SnapshotModal.module.css';
import {useToast} from "@/hooks/useToast.js";

/**
 * 스냅샷 저장을 위해 제목을 입력받는 모달 컴포넌트
 *  useEffect 의존성 최적화 (setTitle 제외)
 *  중복 호출 방지
 */
const MAX_TITLE_LENGTH = 20;
const SnapshotModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    const [title, setTitle] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitle('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () =>
            window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);


    if (!isOpen || typeof document === 'undefined') return null;

    const handleSubmit = () => {
        if (!title.trim()) {
            toast.warning('제목을 입력해주세요');
            return;
        }
        if(title.length > MAX_TITLE_LENGTH){
            toast.warning(`제목은 ${MAX_TITLE_LENGTH}자를 초과할 수 없습니다`);
            return;
        }
        if (isLoading) return;

        onConfirm(title);
    };

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>스냅샷 저장</h3>

                <input
                    type="text"
                    className={styles.input}
                    placeholder="스냅샷 제목을 입력하세요 (예: 반복문 실습)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    maxLength={MAX_TITLE_LENGTH}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isLoading) handleSubmit();
                    }}
                />
                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        취소
                    </button>
                    <button
                        className={styles.saveButton}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? '저장 중...' : '저장'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
export default SnapshotModal;