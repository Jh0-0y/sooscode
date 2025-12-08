// features/auth/components/LoginForm.jsx
import { Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import useLogin from '../hooks/useLogin';
import styles from './AuthForm.module.css';
import LogoutButton from "@/features/auth/components/base/LogoutButton.jsx";

const LoginForm = () => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        onSubmit,
    } = useLogin();

    return (
        <>
            <LogoutButton />
            <h2 className={styles.title}>로그인</h2>
            <p className={styles.subtitle}>SOO'S CODE에 오신 것을 환영합니다.</p>

            <form className={styles.form} onSubmit={onSubmit}>
                {error && <div className={styles.error}>{error}</div>}

                <div>
                    <label className={styles.label}>이메일</label>
                    <div className={styles.inputWrapper}>
                        <FiMail className={styles.inputIcon} />
                        <input
                            className={styles.input}
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className={styles.label}>비밀번호</label>
                    <div className={styles.inputWrapper}>
                        <FiLock className={styles.inputIcon} />
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={loading}
                >
                    {loading ? '로그인 중...' : '로그인'}
                </button>

                <div className={styles.dividerArea}>
                    <div className={styles.line}></div>
                    <span className={styles.orText}>또는</span>
                    <div className={styles.line}></div>
                </div>

                <button
                    type="button"
                    className={styles.googleButton}
                    onClick={() => window.location.href = "http://localhost:8080/api/auth/google/login"}
                >
                    Google로 계속하기
                </button>

                <p className={styles.footerText}>
                    계정이 없으신가요? <Link className={styles.link} to="/register">회원가입</Link>
                </p>
            </form>
        </>
    );
};

export default LoginForm;