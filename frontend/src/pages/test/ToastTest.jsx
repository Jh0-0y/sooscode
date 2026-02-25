import { useToast } from '@/hooks/useToast.js';
import styles from './ToastTest.module.css';

const ToastTest = () => {
    const toast = useToast();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>토스트 테스트</h1>
            <div className={styles.buttonGroup}>
                <button
                    className={`${styles.button} ${styles.success}`}
                    onClick={() => toast.success('성공 메시지입니다!')}
                >
                    Success 토스트
                </button>
                <button
                    className={`${styles.button} ${styles.error}`}
                    onClick={() => toast.error('에러가 발생했습니다.')}
                >
                    Error 토스트
                </button>
                <button
                    className={`${styles.button} ${styles.warning}`}
                    onClick={() => toast.warning('경고 메시지입니다.')}
                >
                    Warning 토스트
                </button>
                <button
                    className={`${styles.button} ${styles.info}`}
                    onClick={() => toast.info('정보 메시지입니다.')}
                >
                    Info 토스트
                </button>
                <button
                    className={`${styles.button} ${styles.custom}`}
                    onClick={() => toast.success('5초 후 사라집니다', 5000)}
                >
                    커스텀 시간 (5초)
                </button>
                <button
                    className={`${styles.button} ${styles.multiple}`}
                    onClick={() => {
                        toast.success('첫 번째 토스트');
                        setTimeout(() => toast.info('두 번째 토스트'), 500);
                        setTimeout(() => toast.warning('세 번째 토스트'), 1000);
                    }}
                >
                    다중 토스트
                </button>
            </div>
        </div>
    );
};

export default ToastTest;