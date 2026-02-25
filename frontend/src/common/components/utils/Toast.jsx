import { useEffect } from 'react';
import { useToastStore } from "@/hooks/useToast.js";  // ★ 수정!
import styles from './Toast.module.css';

const ToastItem = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, toast.duration);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    return (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
            <span className={styles.message}>{toast.message}</span>
            <button
                className={styles.closeButton}
                onClick={() => onRemove(toast.id)}
            >
                ×
            </button>
        </div>
    );
};

const Toast = () => {
    const toasts = useToastStore((state) => state.toasts);       // ★ 수정
    const removeToast = useToastStore((state) => state.removeToast); // ★ 수정

    return (
        <div className={styles.toastContainer}>
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

export default Toast;