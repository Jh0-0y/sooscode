import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/useToast";

const useLogin = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();
    const toast = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await api.post(
                "/api/auth/login",
                { email, password, rememberMe },
                { withCredentials: true }
            );

            setUser(result.data);
            toast.success(result.message);
            navigate("/");
        } catch (err) {
            const message = err.message || "로그인 실패";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        rememberMe,
        setRememberMe,
        loading,
        error,
        onSubmit,
    };
};

export default useLogin;
