// hooks/useError.js
import { useNavigate } from 'react-router-dom';
import {useUser} from "@/hooks/useUser.js";

export const useError = () => {
    const navigate = useNavigate();
    const { clearUser } = useUser();

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

/**
 * 글로벌 에러 핸들링 커스텀 훅
 *
 * Axios 요청 실패 시 상태 코드(401,403,404,500 등)에 따라
 * 자동으로 페이지 이동을 수행하는 에러 처리 훅
 *
 * // 훅 import
 * import { useError } from "@/hooks/useError";
 * // 구조 분해 할당
 * const { handleError } = useError();
 * // 에러 처리 예시
 * try {
 *     const res = await api.get("/mypage");
 * } catch (err) {
 *     handleError(err); // 상태코드 기반 라우팅 처리
 * }
 * // 상태코드 분기
 * 401 → 로그인 필요
 * 403 → 권한 없음
 * 404 → 페이지 없음
 * 500 → 서버 오류
 * 기타 → 공용 에러 페이지 이동
 */