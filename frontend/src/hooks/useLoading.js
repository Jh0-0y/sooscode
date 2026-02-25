import { create } from 'zustand';

const useLoadingStore = create((set) => ({
    loading: false,
    setLoading: (loading) => set({ loading }),
    showLoading: () => set({ loading: true }),
    hideLoading: () => set({ loading: false }),
}));

export const useLoading = () => {
    const loading = useLoadingStore((state) => state.loading);
    const showLoading = useLoadingStore((state) => state.showLoading);
    const hideLoading = useLoadingStore((state) => state.hideLoading);

    return { loading, showLoading, hideLoading };
};

/**
 * 글로벌 로딩 상태 커스텀 훅
 *
 * 비동기 요청 중 로딩 UI 제어를 위한 로딩 스토어 훅
 * showLoading() / hideLoading() 으로 로딩 시작/끝 제어
 *
 * // 훅 import
 * import { useLoading } from "@/hooks/useLoading";
 * // 구조 분해 할당
 * const { loading, showLoading, hideLoading } = useLoading();
 * // 사용 예시
 * const submit = async () => {
 *     try {
 *         showLoading();  // 요청 전 로딩 시작
 *         await api.post("/save"); // 요청 및 응답
 *     } finally {
 *         hideLoading();  // 응답 후 로딩 종료
 *     }
 * };
 * // 로딩 UI 렌더링 예시
 * {loading && <Spinner />}
 */