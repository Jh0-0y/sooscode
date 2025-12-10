import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    timeout: 5000, // 응답 없으면 무한 대기 방지
});

// refresh 중복 호출 방지용 Promise
let refreshPromise = null;

api.interceptors.response.use(
    (response) => response.data,

    async (error) => {
        const originalRequest = error.config;

        // refresh 요청 자체가 실패한 경우 무한루프 방지
        if (originalRequest.url.includes("/api/auth/refresh")) {
            return Promise.reject(error);
        }

        // 401 → 토큰 만료 → refresh 시도
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // 이미 refresh 중이면 그 promise 기다리기
            if (!refreshPromise) {
                refreshPromise = api.post("/api/auth/refresh")
                    .finally(() => {
                        refreshPromise = null; // 끝나면 초기화
                    });
            }

            try {
                await refreshPromise;
                return api(originalRequest);  // 원래 요청 재시도
            } catch (refreshError) {
                // refresh 실패 → 로그인 화면으로 이동
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error.response?.data || error);
    }
);