import { useState, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

/**
 * 클래스 생성 모달 및 생성 로직을 관리하는 커스텀 훅
 * @param {Object} options
 * @param {Function} options.onSuccess - 생성 성공 시 콜백 (생성된 클래스 데이터 전달)
 * @param {Function} options.onError - 생성 실패 시 콜백 (에러 메시지 전달)
 */
const useClassroomCreate = (options = {}) => {
    const { onSuccess, onError } = options;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const openModal = useCallback(() => {
        setIsModalOpen(true);
        setSubmitError(null);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSubmitError(null);
    }, []);

    const handleSubmit = useCallback(async (formData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await adminClassApi.create(formData);

            closeModal();
            onSuccess?.(response.data);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || '클래스 등록에 실패했습니다.';
            setSubmitError(errorMsg);
            onError?.(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsSubmitting(false);
        }
    }, [closeModal, onSuccess, onError]);

    return {
        isModalOpen,
        openModal,
        closeModal,
        isSubmitting,
        submitError,
        handleSubmit,
    };
};

export default useClassroomCreate;