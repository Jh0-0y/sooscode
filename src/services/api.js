import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const SOCKET_URL = `${BASE_URL}/ws`;

export const api = axios.create({
    baseURL: `${BASE_URL}`,
    withCredentials: true,
    timeout: 5000,
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error.response?.data || error)
);

/**
 * 이 로직의 역할 정의
 * 모든 요청의 baseURL를 설정하는 곳
 * withCredentials: true 설정으로 자동으로 브라우저가 요청에 쿠키를 담아줌
 * axios를 이용하여 요청을 보냄(get, post), 바디에 담겨져 있는 데이터를 변수로 얻음
 * 사용법 예시 : const result = await api.get('/api/auth/test');
 *
 * Response 인터셉터
 * 응답 성공 시 response.data (ApiResponse) 추출하여 반환
 * 응답 실패 시 에러 객체의 data (ApiResponse) 추출하여 reject
 */