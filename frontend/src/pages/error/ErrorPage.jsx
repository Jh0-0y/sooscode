// pages/error/ErrorPage.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ErrorPage.module.css';

const ErrorPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const error = location.state?.error;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.code}>{error?.status || '오류'}</h1>
                <h2 className={styles.title}>{error?.code || '문제가 발생했습니다'}</h2>
                <p className={styles.message}>
                    {error?.message || '알 수 없는 오류가 발생했습니다.'}
                </p>
                <div className={styles.actions}>
                    <button className={styles.homeButton} onClick={() => navigate('/')}>
                        홈으로
                    </button>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>
                        이전 페이지
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;