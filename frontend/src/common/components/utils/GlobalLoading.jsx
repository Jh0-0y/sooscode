import { useLoading } from '@/hooks/useLoading';
import styles from './GlobalLoading.module.css';

const GlobalLoading = () => {
    const { loading} = useLoading();

    if (!loading) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.spinner}></div>
        </div>
    );
};

export default GlobalLoading;