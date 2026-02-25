import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.css';

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.code}>403</h1>
                <h2 className={styles.title}>접근 권한이 없습니다</h2>
                <p className={styles.message}>
                    이 페이지에 접근할 수 있는 권한이 없습니다.
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

export default Forbidden;