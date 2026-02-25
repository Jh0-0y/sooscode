import RegisterForm from "@/features/auth/components/RegisterForm.jsx";
import styles from './AuthPage.module.css';

const RegisterPage = () => {

    return (
        <div className={styles.background}>
            <div className={styles.card}>
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;