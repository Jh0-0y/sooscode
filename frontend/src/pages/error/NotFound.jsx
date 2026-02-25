// pages/error/NotFound.jsx
import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.code}>404</h1>
                <h2 className={styles.title}>페이지를 찾을 수 없습니다</h2>
                <p className={styles.message}>
                    요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
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

export default NotFound;