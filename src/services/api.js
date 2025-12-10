import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});

// Response 인터셉터 - 응답 후 처리
api.interceptors.response.use(
    (response) => response.data,  // 성공하면 그냥 통과
    async (error) => {
        const originalRequest = error.config;

        // 401 에러 + 재시도 안 한 요청
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await api.post('/api/auth/refresh');
                return api(originalRequest);  // 원래 요청 재시도
            } catch (refreshError) {
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error.response?.data || error);
    }
);

/**
 * 이 로직의 역할 정의
 * 모든 요청의 baseURL를 설정하는 곳
 * withCredentials: true 설정으로 자동으로 브라우저가 요청에 쿠키를 담아줌
 * axios를 이용하여 요청을 보냄(get, post), 바디에 담겨져 있는 데이터를 변수로 얻음
 * 사용법 예시 : const { data } = await api.get('/api/auth/test');
 *
 * Response 인터셉터
 * 응답이 성공 시에는 그대로 반환해줌
 * 응답에서 에러가 발생했을 때 에러가 인증만료(401)일 경우 AT 재발급 요청을 보내 재발급을 받고
 * 원래 요청을 다시 실행하여 실행한 결과를 반환해줌
 */