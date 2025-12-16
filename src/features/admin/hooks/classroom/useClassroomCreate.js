import { useState, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

/**
 * 클래스 생성 모달 및 생성 로직을 관리하는 커스텀 훅
 *
 * @param {Object} options - 옵션
 * @param {Function} options.onSuccess - 생성 성공 시 콜백 (생성된 클래스 데이터 전달)
 * @param {Function} options.onError - 생성 실패 시 콜백 (에러 메시지 전달)
 */
const useClassroomCreate = (options = {}) => {
    const { onSuccess, onError } = options;

    // ============ 모달 상태 ============
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ============ 제출 상태 ============
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // ============ 모달 핸들러 ============
    /**
     * 모달 열기
     */
    const openModal = useCallback(() => {
        setIsModalOpen(true);
        setSubmitError(null);
    }, []);

    /**
     * 모달 닫기
     */
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSubmitError(null);
    }, []);

    // ============ 제출 핸들러 ============
    /**
     * 클래스 생성 제출
     *
     * @param {Object} formData - 클래스 생성 데이터
     * @returns {Object} { success: boolean, data?: object, error?: string }
     */
    const handleSubmit = useCallback(async (formData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await adminClassApi.create(formData);

            // api.js 인터셉터가 response.data를 반환
            // 실제 클래스 데이터는 response.data에 있음
            const createdClass = response.data;

            // 성공 시 모달 닫기
            closeModal();

            // 성공 콜백 호출
            onSuccess?.(createdClass);

            return { success: true, data: createdClass };
        } catch (err) {
            console.error('클래스 생성 실패:', err);
            const errorMsg = err.message || '클래스 등록에 실패했습니다.';

            setSubmitError(errorMsg);

            // 에러 콜백 호출
            onError?.(errorMsg);

            return { success: false, error: errorMsg };
        } finally {
            setIsSubmitting(false);
        }
    }, [closeModal, onSuccess, onError]);

    // ============ 반환 ============
    return {
        // 모달 상태
        isModalOpen,

        // 제출 상태
        isSubmitting,
        submitError,

        // 핸들러
        openModal,
        closeModal,
        handleSubmit
    };
};

export default useClassroomCreate;
