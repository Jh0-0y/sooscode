import { useState, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

/**
 * 클래스 수정 로직을 관리하는 커스텀 훅
 *
 * @param {Object} options - 옵션
 * @param {Function} options.onSuccess - 수정 성공 시 콜백 (수정된 클래스 데이터 전달)
 * @param {Function} options.onError - 수정 실패 시 콜백 (에러 메시지 전달)
 */
export const useClassroomUpdate = (options = {}) => {
    const { onSuccess, onError } = options;

    // ============ 모달 상태 ============
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ============ 제출 상태 ============
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // ============ 수정 대상 ============
    const [targetClass, setTargetClass] = useState(null);

    // ============ 모달 핸들러 ============
    /**
     * 수정 모달 열기
     *
     * @param {Object} classData - 수정할 클래스 데이터
     */
    const openModal = useCallback((classData) => {
        setTargetClass(classData);
        setIsModalOpen(true);
        setSubmitError(null);
    }, []);

    /**
     * 모달 닫기
     */
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSubmitError(null);
        setTargetClass(null);
    }, []);

    // ============ 제출 핸들러 ============
    /**
     * 클래스 수정 제출
     *
     * @param {Object} formData - 수정할 클래스 데이터
     * @returns {Object} { success: boolean, data?: object, error?: string }
     */
    const handleSubmit = useCallback(async (formData) => {
        if (!targetClass?.classId) {
            const errorMsg = '수정할 클래스 정보가 없습니다.';
            setSubmitError(errorMsg);
            onError?.(errorMsg);
            return { success: false, error: errorMsg };
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await adminClassApi.update(targetClass.classId, formData);

            // api.js 인터셉터가 response.data 반환
            // 실제 클래스 데이터는 response.data에 있음
            const updatedClass = response.data;

            // 성공 시 모달 닫기
            closeModal();

            // 성공 콜백 호출
            onSuccess?.(updatedClass);

            return { success: true, data: updatedClass };
        } catch (err) {
            console.error('클래스 수정 실패:', err);
            const errorMsg = err.message || '클래스 수정에 실패했습니다.';

            setSubmitError(errorMsg);

            // 에러 콜백 호출
            onError?.(errorMsg);

            return { success: false, error: errorMsg };
        } finally {
            setIsSubmitting(false);
        }
    }, [targetClass, closeModal, onSuccess, onError]);

    // ============ 반환 ============
    return {
        // 모달 상태
        isModalOpen,

        // 제출 상태
        isSubmitting,
        submitError,

        // 수정 대상
        targetClass,

        // 핸들러
        openModal,
        closeModal,
        handleSubmit
    };
};

/**
 * 클래스 삭제 로직을 관리하는 커스텀 훅
 *
 * @param {Object} options - 옵션
 * @param {Function} options.onSuccess - 삭제 성공 시 콜백 (삭제된 클래스 ID 전달)
 * @param {Function} options.onError - 삭제 실패 시 콜백 (에러 메시지 전달)
 */
export const useClassroomDelete = (options = {}) => {
    const { onSuccess, onError } = options;

    // ============ 확인 다이얼로그 상태 ============
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // ============ 삭제 상태 ============
    const [isDeleting, setIsDeleting] = useState(false);

    // ============ 삭제 대상 ============
    const [targetClass, setTargetClass] = useState(null);

    // ============ 확인 다이얼로그 핸들러 ============
    /**
     * 삭제 확인 다이얼로그 열기
     *
     * @param {Object} classData - 삭제할 클래스 데이터
     */
    const openConfirm = useCallback((classData) => {
        setTargetClass(classData);
        setIsConfirmOpen(true);
    }, []);

    /**
     * 확인 다이얼로그 닫기
     */
    const closeConfirm = useCallback(() => {
        setIsConfirmOpen(false);
        setTargetClass(null);
    }, []);

    // ============ 삭제 핸들러 ============
    /**
     * 클래스 삭제 실행 (비활성화)
     *
     * @returns {Object} { success: boolean, error?: string }
     */
    const handleDelete = useCallback(async () => {
        if (!targetClass?.classId) {
            onError?.('삭제할 클래스 정보가 없습니다.');
            return { success: false };
        }

        setIsDeleting(true);

        try {
            await adminClassApi.delete(targetClass.classId);

            // 성공 시 다이얼로그 닫기
            closeConfirm();

            // 성공 콜백 호출 (삭제된 클래스 ID 전달)
            onSuccess?.(targetClass.classId);

            return { success: true };
        } catch (err) {
            console.error('클래스 삭제 실패:', err);
            const errorMsg = err.message || '클래스 삭제에 실패했습니다.';

            // 에러 콜백 호출
            onError?.(errorMsg);

            return { success: false, error: errorMsg };
        } finally {
            setIsDeleting(false);
        }
    }, [targetClass, closeConfirm, onSuccess, onError]);

    // ============ 반환 ============
    return {
        // 확인 다이얼로그 상태
        isConfirmOpen,

        // 삭제 상태
        isDeleting,

        // 삭제 대상
        targetClass,

        // 핸들러
        openConfirm,
        closeConfirm,
        handleDelete
    };
};
