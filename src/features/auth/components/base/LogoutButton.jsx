import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const LogoutButton = () => {
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    // 마운트 시 현재 로그인 여부 체크
    useEffect(() => {
        const checkLogin = async () => {
            try {
                await authApi.get("/api/auth/me"); // 200 나오면 로그인 상태
                setIsLogin(true);
            } catch {
                setIsLogin(false);
            }
        };

        checkLogin();
    }, []);

    const onLogout = async () => {
        try {
            await authApi.post("/api/auth/logout"); // 서버가 쿠키 삭제 + RT 제거
        } catch (e) {
            console.log("로그아웃 API 실패", e);
        } finally {
            setIsLogin(false);
            navigate("/");
        }
    };

    if (!isLogin) return null; // 안 로그인 상태면 버튼 안 보이게

    return (
        <button onClick={onLogout}>
            로그아웃
        </button>
    );
};

export default LogoutButton;
