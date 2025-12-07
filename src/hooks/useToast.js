import { useToastStore } from '@/store/toastStore.js';

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
 * 토스트 커스텀 훅 사용법
 * const toast = useToast();로 커스텀 훅 호출
 *
 * 이벤트로 실행
 * ex) <button onClick={() => toast.success("원하는 메시지")} />
 *
 * 메시지 타입은 다음과 같음
 * toast.success/error/warning/info
 *
 * 알림 유지시간은 기본 3초 시간도 커스텀 가능 | 5초면 == 5000(ms 기준)
 * ex) <button onClick={() => toast.info("안녕하세요 sooscode입니다", 5000)} />
 */