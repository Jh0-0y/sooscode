import { create } from 'zustand';

export const useToastStore = create((set) => ({
    toasts: [],
    addToast: (toast) =>
        set((state) => ({
            toasts: [
                ...state.toasts,
                {
                    id: Date.now() + Math.random(),
                    type: toast.type || 'info',
                    message: toast.message,
                    duration: toast.duration || 3000,
                },
            ],
        })),
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
}));

export const useToast = () => {
    const addToast = useToastStore((state) => state.addToast);

    return {
        success: (message, duration) => {
            addToast({ type: 'success', message, duration });
        },
        error: (message, duration) => {
            addToast({ type: 'error', message, duration });
        },
        warning: (message, duration) => {
            addToast({ type: 'warning', message, duration });
        },
        info: (message, duration) => {
            addToast({ type: 'info', message, duration });
        },
    };
};

/**
 * 전역 토스트 알림 커스텀 훅
 *
 * success / error / warning / info 타입의 알림 메시지 훅
 *
 * // 훅 import
 * import { useToast } from "@/hooks/useToast";
 * // 구조 분해 할당
 * const toast = useToast();
 * // 사용 예시
 * toast.success("저장되었습니다");
 * toast.error("요청 실패");
 * toast.info("안내 메시지", 5000); // 유지시간(ms) 지정 가능
 * // 메시지 타입
 * toast.success / toast.error / toast.warning / toast.info
 * // 토스트 UI는 전역 ToastContainer 컴포넌트에서
 * // useToastStore(state => state.toasts)를 기반으로 렌더링하면 됨
 */