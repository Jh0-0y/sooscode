import LoginForm from "@/features/auth/components/LoginForm.jsx";
import styles from './AuthPage.module.css';

const Login = () => {

    return (
        <div className={styles.background}>
            <div className={styles.card}>
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;