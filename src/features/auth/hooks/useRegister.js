// src/features/auth/hooks/useRegister.js
import {useEffect, useState} from "react";
import { api } from "../../../services/api";
import useTimer from "./useTimer";
import { useNavigate } from "react-router-dom";

export default function useRegister() {
    const navigate = useNavigate();
    const { time, start, clear, format } = useTimer();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });


    useEffect(() => {
        const handleBeforeUnload = (e) => {
            // 입력한 값이 하나라도 있으면 경고 실행
            if (form.name || form.email || form.password || form.confirmPassword) {
                e.preventDefault();
                e.returnValue = ""; // Chrome 용
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [form]);


    const [errors, setErrors] = useState({});
    const [verified, setVerified] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [code, setCode] = useState("");
    const [loadingSend, setLoadingSend] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");

    // 값 변경
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({ ...prev, [name]: value }));
        if (name === "password") checkPasswordStrength(value);
    };

    // 비밀번호 강도 계산
    const checkPasswordStrength = (pw) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;

        if (score <= 1) setPasswordStrength("약함");
        else if (score === 2) setPasswordStrength("보통");
        else setPasswordStrength("강함");
    };

    // 유효성 검사
    const validate = () => {
        const newErr = {};

        if (form.name.length < 2 || form.name.length > 20)
            newErr.name = "이름은 2~20자";
        if (form.email.length < 5)
            newErr.email = "이메일은 5자 이상";
        else if (!/\S+@\S+\.\S+/.test(form.email))
            newErr.email = "이메일 형식 오류";

        if (form.password.length < 8 || form.password.length > 20)
            newErr.password = "비밀번호 8~20자";
        if (form.password !== form.confirmPassword)
            newErr.confirmPassword = "비밀번호 불일치";

        if (!verified) newErr.emailVerify = "이메일 인증 필요";

        setErrors(newErr);
        return Object.keys(newErr).length === 0;
    };

    // 인증 코드 전송
    const sendCode = async () => {
        if (!form.email) return alert("이메일 입력 필요");

        try {
            setLoadingSend(true);

            await api.post("/api/auth/email/send", {
                email: form.email,
            });

            alert("인증코드 전송 완료!");
            setShowCodeInput(true);
            start(180); // 3분 타이머

        } catch (_) {
            alert("전송 실패");
        } finally {
            setLoadingSend(false);
        }
    };

    // 인증 코드 검증
    const verifyCode = async () => {

        if (!code || code.length !== 6) {
            alert("인증코드는 6자리 숫자입니다.");
            return;
        }

        try {
            const { data } = await api.post("/api/auth/email/verify", {
                email: form.email,
                code,
            });

            if (data.success) {
                alert("인증 성공!");
                setVerified(true);
                clear();
            } else {
                alert("잘못된 코드");
            }
        } catch {
            alert("인증 오류");
        }
    };


    // 회원가입
    const submit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await api.post("/api/auth/register", {
                email: form.email,
                name: form.name,
                password: form.password,
                confirmPassword: form.confirmPassword
            });

            alert("회원가입 성공!");
            navigate("/login");

        } catch {
            alert("회원가입 실패");
        }
    };

    return {
        form,
        errors,
        verified,
        showCodeInput,
        code,
        loadingSend,
        passwordStrength,
        time,
        format,
        handleChange,
        setCode,
        sendCode,
        verifyCode,
        submit,
    };
}
