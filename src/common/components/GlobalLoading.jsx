import { useLoadingStore } from '@/store/loadingStore.js';
import styles from './GlobalLoading.module.css';

const GlobalLoading = () => {
    const loading = useLoadingStore((state) => state.loading);

    if (!loading) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.spinner}></div>
        </div>
    );
};

export default GlobalLoading;