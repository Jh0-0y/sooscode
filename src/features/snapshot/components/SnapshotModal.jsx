import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/SnapshotModal.module.css';

/**
 * 스냅샷 저장을 위해 제목을 입력받는 모달 컴포넌트
 * Refactored based on Code Review:
 * 1. useEffect 의존성 최적화 (setTitle 제외)
 * 2. SSR/Test 환경 고려 (document check)
 * 3. UX 개선 (ESC 닫기)
 * 4. 중복 호출 방지 (isLoading 처리)
 */
const SnapshotModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    const [title, setTitle] = useState('');

    // 1. 모달이 열릴 때마다 제목 초기화
    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitle('');
        }
    }, [isOpen]);

    // 2. ESC 키로 닫기
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // 3. Portal + SSR 안정성 가드
    if (!isOpen || typeof document === 'undefined') return null;

    const handleSubmit = () => {
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        // 저장 중이면 중복 실행 방지
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
                    // 저장 중 입력 방지
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
                        // 저장 중 버튼 비활성화
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