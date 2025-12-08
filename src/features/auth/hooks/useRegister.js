import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { isEmpty, isEmail, isPassword, isLength } from '@/utils/validation';

const useRegister = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const navigate = useNavigate();
    /* 공용 훅 사용중 */
    const toast = useToast();

    const checkPasswordStrength = (password) => {
        if (!password) return '';
        if (password.length < 6) return '약함';
        if (password.length < 10) return '보통';
        return '강함';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // 해당 필드 에러 제거
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }

        // 비밀번호 강도 체크
        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (isEmpty(form.name)) {
            newErrors.name = '이름을 입력해주세요.';
        } else if (!isLength(form.name, 2, 20)) {
            newErrors.name = '이름은 2~20자여야 합니다.';
        }

        if (isEmpty(form.email)) {
            newErrors.email = '이메일을 입력해주세요.';
        } else if (!isEmail(form.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다.';
        }

        if (isEmpty(form.password)) {
            newErrors.password = '비밀번호를 입력해주세요.';
        } else if (!isPassword(form.password)) {
            newErrors.password = '비밀번호는 8~16자, 영문+숫자 필수입니다.';
        }

        if (isEmpty(form.confirmPassword)) {
            newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            await api.post('/api/auth/register', {
                name: form.name,
                email: form.email,
                password: form.password,
                confirmPassword: form.confirmPassword,
            });

            toast.success('회원가입이 완료되었습니다.');
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.message || '회원가입에 실패했습니다.';
            setErrors({ form: errorMessage });
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        errors,
        loading,
        passwordStrength,
        handleChange,
        handleSubmit,
    };
};

export default useRegister;