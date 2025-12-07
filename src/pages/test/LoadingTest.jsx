import { useLoadingStore } from '@/store/loadingStore';
import { api } from '@/services/api';
import styles from './LoadingTest.module.css';

const LoadingTest = () => {
    const setLoading = useLoadingStore((state) => state.setLoading);

    const handleTest = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/auth/test');
            console.log(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>로딩 테스트</h1>
            <button className={styles.button} onClick={handleTest}>
                API 요청
            </button>
        </div>
    );
};

export default LoadingTest;