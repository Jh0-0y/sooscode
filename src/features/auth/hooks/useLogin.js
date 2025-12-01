import {useState} from "react";
import {useNavigate} from "react-router-dom";
import authService from "@/features/auth/services/authService.js";


const useLogin = (setIsLogin) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authService.post("/api/auth/login", {email, password});
            localStorage.setItem("accessToken", res.data.accessToken);
            setIsLogin(true);
            navigate("/");
        } catch {
            alert("로그인 실패");
        }
    };
    return {
        onSubmit,
        setEmail,
        setPassword,
        email
    };
}

export default useLogin