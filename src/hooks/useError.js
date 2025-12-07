// hooks/useError.js
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

export const useError = () => {
    const navigate = useNavigate();
    const clearUser = useUserStore((state) => state.clearUser);

    const handleError = (error) => {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
            case 401:
                // 인증 필요 → 로그인 페이지
                clearUser();
                navigate('/login', { replace: true });
                break;

            case 403:
                // 권한 없음 → 403 페이지
                navigate('/error/403', { replace: true });
                break;

            case 404:
                // 리소스 없음 → 404 페이지
                navigate('/error/404', { replace: true });
                break;

            case 500:
                // 서버 에러 → 500 페이지
                navigate('/error/500', { replace: true });
                break;

            default:
                // 기타 에러 → 공용 에러 페이지 (서버 메시지 표시)
                navigate('/error', {
                    replace: true,
                    state: { error: errorData },
                });
                break;
        }
    };

    return { handleError };
};