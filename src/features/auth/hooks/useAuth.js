import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";


const useAuth= () => {
    const [form, setForm] = useState({name: "", email: "", password: "", confirmPassword: "",});
    const [errors, setErrors] = useState({});
    //const [verified, setVerified] = useState(false);
    const [code, setCode] = useState("");
    //const [showCodeInput, setShowCodeInput] = useState(false);
    //const [sendLoading, setSendLoading] = useState(false);
    //const [timer, setTimer] = useState(0);
    //const [intervalId, setIntervalId] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState("");
    const navigate = useNavigate();
    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
        if (name === "password") checkPasswordStrength(value);
    };

    const checkPasswordStrength = (pw) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        if (score <= 1) setPasswordStrength("약함"); else if (score === 2) setPasswordStrength("보통"); else setPasswordStrength("강함");
    };

    const validate = () => {
        let newErrors = {};
        if (form.email.length < 5 || form.email.length > 100) newErrors.email = "이메일은 5~100자"; else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "이메일 형식 오류";
        if (form.password.length < 8 || form.password.length > 20) newErrors.password = "비밀번호 8~20자";
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = "비밀번호 불일치";
        if (form.name.length < 2 || form.name.length > 20) newErrors.name = "이름은 2~20자";
        //if (!verified) newErrors.emailVerify = "이메일 인증 필요";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // const startTimer = (sec) => {
    //     if (intervalId) clearInterval(intervalId);
    //     setTimer(sec);
    //     const id = setInterval(() => {
    //         setTimer((prev) => {
    //             if (prev <= 1) {
    //                 clearInterval(id);
    //                 return 0;
    //             }
    //             return prev - 1;
    //         });
    //     }, 1000);
    //     setIntervalId(id);
    // };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? "0" + s : s}`;
    };

    // const sendCode = async () => {
    //     if (!form.email) return alert("이메일 입력 필요");
    //     try {
    //         setSendLoading(true);
    //         await axios.post("http://localhost:8080/api/auth/email/send", {email: form.email,});
    //         alert("인증코드 전송 완료");
    //         setShowCodeInput(true);
    //         startTimer(180);
    //     } catch {
    //         alert("전송 실패");
    //     } finally {
    //         setSendLoading(false);
    //     }
    // };

    // const verifyCode = async () => {
    //     try {
    //         const {data} = await axios.post("http://localhost:8080/api/auth/email/verify", {email: form.email, code});
    //         if (data.verified) {
    //             alert("인증 성공!");
    //             setVerified(true);
    //             clearInterval(intervalId);
    //             setTimer(0);
    //         } else alert("잘못된 코드");
    //     } catch {
    //         alert("인증 오류");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            await axios.post("http://localhost:8080/api/auth/register", {
                email: form.email,
                password: form.password,
                name: form.name,
            });
            alert("회원가입 성공");
            navigate("/login");
        } catch {
            alert("회원가입 실패");
        }
    };

    return {
        form,
        errors,
        //verified,
        code,
        setCode,
        //showCodeInput,
        //sendLoading,
        //timer,
        passwordStrength,
        handleChange,
        formatTime,
        //sendCode,
        //verifyCode,
        handleSubmit,
    };
}

export default useAuth