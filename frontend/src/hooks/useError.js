// hooks/useError.js
import { useNavigate } from 'react-router-dom';
import { useUser } from "@/hooks/useUser.js";

export const useError = () => {
    const navigate = useNavigate();
    const { clearUser } = useUser();

    const handleError = (error) => {
        const status = error.response?.status;
        const errorData = error.response?.data; // { success, status, code, message }

        // 401은 로그인 페이지로 바로 이동
        if (status === 401) {
            clearUser();
            navigate('/login', { replace: true });
            return;
        }

        // 나머지 에러는 에러 데이터를 state로 전달
        switch (status) {
            case 403:
                navigate('/error/403', {
                    replace: true,
                    state: { error: errorData }
                });
                break;

            case 404:
                navigate('/error/404', {
                    replace: true,
                    state: { error: errorData }
                });
                break;

            case 500:
                navigate('/error/500', {
                    replace: true,
                    state: { error: errorData }
                });
                break;

            default:
                // 기타 에러 → 공용 에러 페이지
                navigate('/error', {
                    replace: true,
                    state: { error: errorData },
                });
                break;
        }
    };

    return { handleError };
};

/**
 * 글로벌 에러 핸들링 커스텀 훅
 *
 * Axios 요청 실패 시 서버에서 내려온 에러 데이터를 state로 전달하여
 * 각 에러 페이지에서 status, code, message를 표시
 *
 * 서버 응답 형태:
 * {
 *   "success": false,
 *   "status": 401,
 *   "code": "GLOBAL_401",
 *   "message": "인증이 필요합니다"
 * }
 *
 * 사용법:
 * import { useError } from "@/hooks/useError";
 *
 * const { handleError } = useError();
 *
 * try {
 *     const res = await api.get("/mypage");
 * } catch (err) {
 *     handleError(err);
 * }
 */