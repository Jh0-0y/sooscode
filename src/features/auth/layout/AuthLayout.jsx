import { Outlet } from "react-router-dom";
import styles from "@/pages/auth/AuthPage.module.css";
import authService from "@/features/auth/services/authService.js";

const AuthLayout = ({setIsLogin}) => {

    // 추후 헤더로 이동될 코드
    const onLogout = async () => {
        try {
            await authService.post("/api/auth/logout");
        } catch (e) {
            console.log("로그아웃 API 실패");
        }

        localStorage.removeItem("accessToken");
        setIsLogin(false);
    };

    return (
        <div className={styles.background}>
            <div className={styles.card}>
                <Outlet />
            </div>

            <button onClick={onLogout} className={styles.error}>
                로그아웃
            </button>
        </div>
    );
}
export default AuthLayout