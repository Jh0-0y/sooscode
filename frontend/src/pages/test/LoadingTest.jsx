import { useLoading } from "@/hooks/useLoading.js";
import { api } from '@/services/api';
import styles from './LoadingTest.module.css';

const LoadingTest = () => {
    const {showLoading, hideLoading } = useLoading();

    const handleTest = async () => {
        showLoading();
        try {
            const { data } = await api.get('/api/auth/test');
            console.log(data);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoading();
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>로딩 화면 테스트</h1>
            <button className={styles.button} onClick={handleTest}>
                API 요청
            </button>
        </div>
    );
};

export default LoadingTest;