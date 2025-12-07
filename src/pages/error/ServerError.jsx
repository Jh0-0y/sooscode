// pages/error/ServerError.jsx
import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.css';

const ServerError = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.code}>500</h1>
                <h2 className={styles.title}>서버 오류가 발생했습니다</h2>
                <p className={styles.message}>
                    일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                </p>
                <div className={styles.actions}>
                    <button className={styles.homeButton} onClick={() => navigate('/')}>
                        홈으로
                    </button>
                    <button className={styles.backButton} onClick={() => window.location.reload()}>
                        새로고침
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServerError;